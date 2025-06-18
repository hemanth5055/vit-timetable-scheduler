import { createContext, useState } from "react";
import theoryData from "../data/theory.subjects";
import labData from "../data/lab.subjects";

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
