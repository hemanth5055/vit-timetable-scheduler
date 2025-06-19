import { createContext, useState, useMemo } from "react";
import theoryData from "../data/theory.subjects";
import labData from "../data/lab.subjects";
import { theoryDataTimeTable, labDataTimeTable } from "../data/timetable";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [morning, setMorning] = useState(true); // true → morning
  const [validCombinations, setValidCombinations] = useState([]);
  const [showOnTimetable, setShowOnTimetable] = useState({});

  // Memoize the lab-to-theory mapping for better performance
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
  }, [theoryDataTimeTable, labDataTimeTable]);

  // Helper class for better structure
  class Subject {
    constructor(name, availableSlots = [], isLab = false) {
      this.name = name;
      this.availableSlots = availableSlots;
      this.isLab = isLab;
    }
  }

  // Improved clash detection with better logic separation
  const findClash = (newSlot, occupiedSlots, isLab) => {
    const newParts = newSlot.split("+");
    for (const occupied of occupiedSlots) {
      const occupiedParts = occupied.split("+");
      // Theory-theory or theory-lab clash
      if (!isLab) {
        if (newParts.some((part) => occupiedParts.includes(part))) {
          return true;
        }
      } else {
        // Check if the lab slot itself is already used (lab-lab clash)
        if (newParts.some((part) => occupiedParts.includes(part))) {
          return true;
        }

        // Check lab slot's mapped theory parts
        for (const part of newParts) {
          const mapped = labSlotToTheorySlotMap[part];
          const mappedParts = Array.isArray(mapped) ? mapped : [mapped];

          for (const theorySlot of mappedParts) {
            if (
              occupiedParts.some((occupiedPart) => theorySlot === occupiedPart)
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  };

  // Recursive combination finder with better error handling
  const findRecCombinations = (
    subjectIndex,
    currentFilledSlots,
    allResults,
    subjects
  ) => {
    // Base case: all subjects processed
    if (subjectIndex === subjects.length) {
      allResults.push([...currentFilledSlots]);
      return;
    }

    const currentSubject = subjects[subjectIndex];

    // Try each available slot for the current subject
    for (const slot of currentSubject.availableSlots) {
      if (!findClash(slot, currentFilledSlots, currentSubject.isLab)) {
        // No clash found, add this slot and recurse
        currentFilledSlots.push(slot);
        findRecCombinations(
          subjectIndex + 1,
          currentFilledSlots,
          allResults,
          subjects
        );
        currentFilledSlots.pop(); // Backtrack
      }
    }
  };

  // Main function to find all valid combinations
  const findCombinations = () => {
    if (Object.keys(selectedSubjects).length === 0) {
      console.warn(
        "No subjects selected. Please select subjects and their slots."
      );
      setValidCombinations([]);
      return [];
    }

    try {
      // Convert selected subjects to Subject instances
      const subjects = Object.entries(selectedSubjects)
        .map(
          ([name, config]) =>
            new Subject(name, config.slots || [], config.isLab || false)
        )
        .filter((subject) => subject.availableSlots.length > 0) // Only include subjects with available slots
        .sort((a, b) => a.isLab - b.isLab); // Sort: theory subjects first, then labs

      if (subjects.length === 0) {
        console.warn("No subjects with available slots found.");
        setValidCombinations([]);

        return [];
      }

      const results = [];
      const filledSlots = [];

      findRecCombinations(0, filledSlots, results, subjects);

      console.log(`Found ${results.length} valid combinations:`, results);
      setValidCombinations(results);
      setShowOnTimetable({ combination: results[0], subjectsOrder: subjects });
      return results;
    } catch (error) {
      console.error("Error finding combinations:", error);
      setValidCombinations([]);
      return [];
    }
  };

  return (
    <DataContext.Provider
      value={{
        // State
        selectedSubjects,
        setSelectedSubjects,
        morning,
        setMorning,
        validCombinations,
        // Data
        theoryData,
        labData,
        theoryDataTimeTable,
        labDataTimeTable,
        labSlotToTheorySlotMap,
        // Core functions
        findCombinations,
        //timetable functions
        showOnTimetable,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
