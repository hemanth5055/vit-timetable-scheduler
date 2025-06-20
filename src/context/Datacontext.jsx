import { createContext, useState, useMemo, useEffect } from "react";
import theoryData from "../data/theory.subjects";
import labData from "../data/lab.subjects";
import { theoryDataTimeTable, labDataTimeTable } from "../data/timetable";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [morning, setMorning] = useState(true);
  const [validCombinations, setValidCombinations] = useState([]);
  const [showOnTimetable, setShowOnTimetable] = useState(-1);

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

  const findCombinations = () => {
    if (Object.keys(selectedSubjects).length === 0) {
      console.warn(
        "No subjects selected. Please select subjects and their slots."
      );
      setValidCombinations([]);

      return [];
    }

    try {
      const subjects = Object.entries(selectedSubjects)
        .map(
          ([name, config]) =>
            new Subject(name, config.slots || [], config.isLab || false)
        )
        .filter((subject) => subject.availableSlots.length > 0)
        .sort((a, b) => a.isLab - b.isLab);

      if (subjects.length === 0) {
        console.warn("No subjects with available slots found.");
        setValidCombinations([]);
        return [];
      }

      const results = [];
      const filledSlots = [];

      findRecCombinations(0, filledSlots, results, subjects);
      console.log(results);
      const structured = results.map((combination) => ({
        combination,
        subjectsOrder: subjects,
      }));

      console.log(`Found ${structured.length} valid combinations`);
      setValidCombinations(structured);
      setShowOnTimetable(0);
      return structured;
    } catch (error) {
      console.error("Error finding combinations:", error);
      setValidCombinations([]);
      return [];
    }
  };

  const handleNext = () => {
    setShowOnTimetable((prev) => (prev + 1) % validCombinations.length);
  };

  const handlePrev = () => {
    setShowOnTimetable(
      (prev) => (prev - 1 + validCombinations.length) % validCombinations.length
    );
  };

  return (
    <DataContext.Provider
      value={{
        // States
        selectedSubjects,
        setSelectedSubjects,
        morning,
        setMorning,
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
