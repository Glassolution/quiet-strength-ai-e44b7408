import { useState, useEffect } from "react";

export interface ProgressState {
  startDate: string | null; // ISO string date
  daysFree: number;
}

export function useProgress() {
  const [startDate, setStartDate] = useState<string | null>(() => {
    const stored = localStorage.getItem("axon-sobriety-start-date");
    return stored || null;
  });

  const [daysFree, setDaysFree] = useState<number>(0);

  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      // Se a data de início é hoje, considera 1 dia (o dia 1 da jornada) ou 0?
      // Geralmente "x dias livre" implica dias completos ou o dia corrente.
      // Vou considerar dias completos arredondados para baixo + 1 (dia atual) ou apenas diffDays.
      // Se começou agora, é dia 0 ou 1? Vamos usar Math.floor e considerar que se começou hoje, tem 0 dias completos, mas está no 1º dia.
      // O usuário pediu "3 dias livre". Se começou há 3 dias.
      
      const diffDaysFloored = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysFree(diffDaysFloored);
    } else {
      setDaysFree(0);
    }
  }, [startDate]);

  const startJourney = () => {
    const now = new Date().toISOString();
    localStorage.setItem("axon-sobriety-start-date", now);
    setStartDate(now);
  };

  const resetJourney = () => {
    // Resetar significa começar de novo agora
    startJourney();
  };

  const clearHistory = () => {
    localStorage.removeItem("axon-sobriety-start-date");
    setStartDate(null);
  };

  return {
    daysFree,
    startDate,
    startJourney,
    resetJourney,
    clearHistory
  };
}
