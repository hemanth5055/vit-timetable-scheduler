import { createContext, useState } from "react";
import theoryData from "../data/theory.subjects";
import labData from "../data/lab.subjects";
import { theoryDataTimeTable, labDataTimeTable } from "../data/timetable";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [morning, setMorning] = useState(true); //true->morning

  return (
    <DataContext.Provider
      value={{
        selectedSubjects,
        setSelectedSubjects,
        theoryData,
        labData,
        morning,
        setMorning,
        theoryDataTimeTable,
        labDataTimeTable,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
