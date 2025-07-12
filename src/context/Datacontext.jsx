import { createContext, useState, useMemo, useEffect, useRef } from "react";
import theoryData from "../data/theory.subjects";
import labData from "../data/lab.subjects";
import toast from "react-hot-toast";
import { theoryDataTimeTable, labDataTimeTable } from "../data/timetable";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const timetableRef = useRef();
  const [validCombinations, setValidCombinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnTimetable, setShowOnTimetable] = useState(0);

  // Create a mapping of time slots to all slots that occur at the same time
  const mutuallyExclusiveSlots = useMemo(() => {
    const slotConflicts = {};
    
    // Process each time slot across both theory and lab data
    for (let day = 0; day < Math.max(theoryDataTimeTable.length, labDataTimeTable.length); day++) {
      for (let time = 0; time < Math.max(
        theoryDataTimeTable[day]?.length || 0,
        labDataTimeTable[day]?.length || 0
      ); time++) {
        const allSlotsAtThisTime = [];
        
        // Get theory slots at this time
        if (theoryDataTimeTable[day] && theoryDataTimeTable[day][time]) {
          const theorySlot = theoryDataTimeTable[day][time];
          if (theorySlot !== "FREE") {
            if (Array.isArray(theorySlot)) {
              allSlotsAtThisTime.push(...theorySlot);
            } else {
              allSlotsAtThisTime.push(theorySlot);
            }
          }
        }
        
        // Get lab slots at this time
        if (labDataTimeTable[day] && labDataTimeTable[day][time]) {
          const labSlot = labDataTimeTable[day][time];
          if (labSlot !== "FREE") {
            if (Array.isArray(labSlot)) {
              allSlotsAtThisTime.push(...labSlot);
            } else {
              allSlotsAtThisTime.push(labSlot);
            }
          }
        }
        
        // If there are multiple slots at this time, they're mutually exclusive
        if (allSlotsAtThisTime.length > 1) {
          allSlotsAtThisTime.forEach(slot => {
            if (!slotConflicts[slot]) {
              slotConflicts[slot] = [];
            }
            // Add all other slots at this time as conflicts
            slotConflicts[slot] = [...new Set([
              ...slotConflicts[slot],
              ...allSlotsAtThisTime.filter(s => s !== slot)
            ])];
          });
        }
      }
    }
    
    return slotConflicts;
  }, []);

  // Update localStorage when selectedSubjects changes
  useEffect(() => {
    if (Object.keys(selectedSubjects).length > 0) {
      localStorage.setItem("subjects", JSON.stringify(selectedSubjects));
    }
  }, [selectedSubjects]);

  // Load from localStorage on component mount
  useEffect(() => {
    const subs = localStorage.getItem("subjects");
    if (subs) {
      try {
        const parsedSubs = JSON.parse(subs);
        setSelectedSubjects(parsedSubs);
      } catch (error) {
        console.error("Failed to parse subjects from localStorage:", error);
        toast.error(
          "Failed to load subjects from localStorage. Please reset your selection."
        );
      }
    }
  }, []);

  const labSlotToTheorySlotMap = useMemo(() => {
    const generateLabToTheoryMap = (theoryData, labData) => {
      const map = {};
      for (let day = 0; day < labData.length; day++) {
        for (let time = 0; time < labData[day].length; time++) {
          const labSlot = labData[day][time];
          const theorySlot = theoryData[day][time];

          if (Array.isArray(theorySlot)) {
            map[labSlot] = theorySlot.length === 1 ? theorySlot[0] : theorySlot;
          } else {
            map[labSlot] = theorySlot;
          }
        }
      }
      return map;
    };

    return generateLabToTheoryMap(theoryDataTimeTable, labDataTimeTable);
  }, []);

  class Subject {
    constructor(name, availableSlots = [], isLab = false) {
      this.name = name;
      this.availableSlots = availableSlots;
      this.isLab = isLab;
    }
  }

  const findClash = (newSlot, occupiedSlots, isLab) => {
    const newParts = newSlot.split("+");
    
    for (const occupied of occupiedSlots) {
      const occupiedParts = occupied.split("+");
      
      // Check direct slot conflicts
      if (newParts.some((part) => occupiedParts.includes(part))) {
        return true;
      }
      
      // Check mutually exclusive slots (slots at same time)
      for (const newPart of newParts) {
        const mutuallyExclusiveWithNew = mutuallyExclusiveSlots[newPart] || [];
        if (occupiedParts.some(occupiedPart => mutuallyExclusiveWithNew.includes(occupiedPart))) {
          return true;
        }
      }
    }
    return false;
  };

  const findRecCombinations = (
    subjectIndex,
    currentFilledSlots,
    allResults,
    subjects
  ) => {
    if (subjectIndex === subjects.length) {
      allResults.push([...currentFilledSlots]);
      return;
    }

    const currentSubject = subjects[subjectIndex];

    for (const slot of currentSubject.availableSlots) {
      console.log(slot);
      if (!findClash(slot, currentFilledSlots, currentSubject.isLab)) {
        currentFilledSlots.push(slot);
        findRecCombinations(
          subjectIndex + 1,
          currentFilledSlots,
          allResults,
          subjects
        );
        currentFilledSlots.pop();
      }
    }
  };

  const calculateSlotCredits = (slotString) => {
    const slots = slotString.split("+");
    switch (slots.length) {
      case 3:
        return 4;
      case 2:
        if (slots[0].includes("L")) return 1;
        return 3;
      case 1:
        if (slots[0].length == 2) return 2;
        return 1;
    }
  };

  const findCombinations = async () => {
    console.log("Selected subjects:", Object.keys(selectedSubjects));

    // Early validation
    if (Object.keys(selectedSubjects).length === 0) {
      toast.error("Please select at least one subject.");
      return [];
    }

    try {
      // Create and filter subjects
      const subjects = Object.entries(selectedSubjects)
        .map(
          ([name, config]) =>
            new Subject(name, config.slots || [], config.isLab || false)
        )
        .filter((subject) => subject.availableSlots.length > 0)
        .sort((a, b) => a.isLab - b.isLab);

      // Check if we have valid subjects
      if (subjects.length === 0) {
        const message = "Please select subjects with available time slots.";
        console.warn(message);
        toast.error(message);
        setValidCombinations([]);
        return [];
      }

      // Find combinations using recursive algorithm
      const results = [];
      const filledSlots = [];

      findRecCombinations(0, filledSlots, results, subjects);

      console.log(`Valid combinations found: ${results.length}`);

      // Handle no results case
      if (results.length === 0) {
        toast.error(
          "No valid timetable combinations found. Try adjusting your subject selections."
        );
        setValidCombinations([]);
        return [];
      }

      // Calculate total credits
      let totalCredits = 0;
      for (let i = 0; i < results[0].length; i++) {
        totalCredits += calculateSlotCredits(results[0][i]);
      }

      // Structure the results
      const structuredResults = {
        combinations: results,
        subjectsOrder: subjects,
        totalCredits,
      };

      // Batch state updates for better performance
      setValidCombinations(structuredResults);
      setShowOnTimetable(0);

      toast.success(
        `Found ${results.length} valid combination${
          results.length === 1 ? "" : "s"
        }`
      );
      
      setTimeout(() => {
        timetableRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
      return structuredResults;
    } catch (error) {
      console.error("Error finding combinations:", error);

      // More specific error handling
      const errorMessage =
        error.message ||
        "An unexpected error occurred while finding combinations.";
      toast.error(errorMessage);

      setValidCombinations([]);
      return [];
    }
  };

  const handleNext = () => {
    if (!validCombinations?.combinations?.length) return;
    setShowOnTimetable(
      (prev) => (prev + 1) % validCombinations.combinations.length
    );
  };

  const handlePrev = () => {
    if (!validCombinations?.combinations?.length) return;
    setShowOnTimetable(
      (prev) =>
        (prev - 1 + validCombinations.combinations.length) %
        validCombinations.combinations.length
    );
  };

  return (
    <DataContext.Provider
      value={{
        // States
        selectedSubjects,
        setSelectedSubjects,
        validCombinations,
        showOnTimetable,
        setShowOnTimetable,
        // Data
        theoryData,
        labData,
        theoryDataTimeTable,
        labDataTimeTable,
        labSlotToTheorySlotMap,
        mutuallyExclusiveSlots,
        // Methods
        findCombinations,
        handleNext,
        handlePrev,
        // Ref
        timetableRef,
        // Search
        searchTerm,
        setSearchTerm
      }}
    >
      {children}
    </DataContext.Provider>
  );
};