import { createContext, useState, useMemo, useEffect } from "react";
import theoryData from "../data/theory.subjects";
import labData from "../data/lab.subjects";
import { toast } from "react-toastify";
import { theoryDataTimeTable, labDataTimeTable } from "../data/timetable";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [selectedSubjects, setSelectedSubjects] = useState({});
  // const [morning, setMorning] = useState(true);
  const [validCombinations, setValidCombinations] = useState([]);
  const [showOnTimetable, setShowOnTimetable] = useState(0);

  //update localstorage when selectedSubjects changes
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

      if (!isLab) {
        if (newParts.some((part) => occupiedParts.includes(part))) {
          return true;
        }
      } else {
        if (newParts.some((part) => occupiedParts.includes(part))) {
          return true;
        }

        for (const part of newParts) {
          const mapped = labSlotToTheorySlotMap[part];
          const mappedParts = Array.isArray(mapped) ? mapped : [mapped];

          for (const theorySlot of mappedParts) {
            if (occupiedParts.includes(theorySlot)) {
              return true;
            }
          }
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

  // const findCombinations = () => {
  //   console.log(Object.keys(selectedSubjects));
  //   if (Object.keys(selectedSubjects).length === 0) {
  //     toast.error("Please select at least one subject.");
  //   }
  //   try {
  //     const subjects = Object.entries(selectedSubjects)
  //       .map(
  //         ([name, config]) =>
  //           new Subject(name, config.slots || [], config.isLab || false)
  //       )
  //       .filter((subject) => subject.availableSlots.length > 0)
  //       .sort((a, b) => a.isLab - b.isLab);
  //     if (subjects.length === 0) {
  //       console.warn("No subjects with available slots found.");
  //       setValidCombinations([]);
  //     }
  //     const results = [];
  //     const filledSlots = [];
  //     findRecCombinations(0, filledSlots, results, subjects);
  //     console.log("Valid combinations found:", results);
  //     if (results.length == 0) {
  //       toast.error("No valid combinations found.");
  //       setValidCombinations([]);
  //       return [];
  //     }
  //     const structured = results.map((combination) => ({
  //       combination,
  //       subjectsOrder: subjects,
  //     }));
  //     setValidCombinations(structured);
  //     toast.success(`Found ${structured.length} valid combinations`);
  //     setShowOnTimetable(0);
  //     return structured;
  //   } catch (error) {
  //     console.error("Error finding combinations:", error);
  //     toast.error("An error occurred while finding combinations.");
  //     setValidCombinations([]);
  //     return [];
  //   }
  // };
  const calculateSlotCredits = (slotString) => {
    const slots = slotString.split("+");

    switch (slots.length) {
      case 1:
        // Single slot
        return slots[0].length === 2 ? 2 : 1;

      case 2:
        // Two combined slots
        return slots[0].startsWith("L") ? 2 : 3;

      default:
        // Multiple combined slots (3 or more)
        return slots.length + 1;
    }
  };

  const findCombinations = () => {
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

      //finding the registered credits
      let totalCredits = 0;
      for (let i = 0; i < results[0].length; i++) {
        totalCredits += calculateSlotCredits(results[0][i]);
      }
      // Structure the results
      // const structuredResults = results.map((combination) => ({
      //   combination,
      //   subjectsOrder: subjects,
      //   totalCredits: totalCredits,
      // }));
      const structuredResults = {
        combinations: results,
        subjectsOrder: subjects,
        totalCredits,
      };

      console.log(structuredResults);
      // Batch state updates for better performance
      setValidCombinations(structuredResults);
      setShowOnTimetable(0);

      toast.success(
        `Found ${results.length} valid combination${
          results.length === 1 ? "" : "s"
        }`
      );

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
    setShowOnTimetable(
      (prev) => (prev + 1) % validCombinations.combinations.length
    );
  };

  const handlePrev = () => {
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
        // morning,
        // setMorning,
        validCombinations,
        showOnTimetable,
        setShowOnTimetable,
        // Data
        theoryData,
        labData,
        theoryDataTimeTable,
        labDataTimeTable,
        labSlotToTheorySlotMap,
        // Methods
        findCombinations,
        handleNext,
        handlePrev,
        //notifications
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
