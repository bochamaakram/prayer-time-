import React, { useState, useEffect, useCallback } from "react";
import "./prayer.css";
function Prayer() {
  const [city, setCity] = useState("Marrakech");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState("--:--:--");
  const [isLoading, setIsLoading] = useState(false);

  const prayerTranslations = React.useMemo(
    () => ({
      Fajr: "الفجر",
      Dhuhr: "الظهر",
      Asr: "العصر",
      Maghrib: "المغرب",
      Isha: "العشاء",
    }),
    []
  );

  const prayerOrder = React.useMemo(
    () => ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"],
    []
  );

  // Fetch Prayer Times from API
  const fetchPrayerTimes = async (selectedCity) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity}&country=Morocco&method=4`
      );
      const data = await response.json();
      setPrayerTimes(data.data.timings || {});
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      alert("Error fetching prayer times. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the next prayer
  const calculateNextPrayer = useCallback(() => {
    if (!prayerTimes) return null;

    const now = new Date();
    for (const prayer of prayerOrder) {
      const [hour, minute] = prayerTimes[prayer]?.split(":") || [0, 0];
      const prayerTime = new Date();
      prayerTime.setHours(Number(hour), Number(minute), 0, 0);

      if (now < prayerTime) {
        return { time: prayerTime, name: prayerTranslations[prayer] };
      }
    }

    // If all prayers have passed, set next to Fajr the next day
    const [fajrHour, fajrMinute] = (prayerTimes.Fajr?.split(":") || ["00", "00"]).map(Number);
    const nextDayFajr = new Date();
    nextDayFajr.setDate(now.getDate() + 1);
    nextDayFajr.setHours(fajrHour, fajrMinute, 0, 0);

    return { time: nextDayFajr, name: prayerTranslations.Fajr };
  }, [prayerTimes, prayerOrder, prayerTranslations]);

  // Update Countdown Timer
  const updateCountdown = useCallback(() => {
    if (!nextPrayer?.time) return;

    const now = new Date();
    const timeDiff = nextPrayer.time - now;

    if (timeDiff <= 0) {
      fetchPrayerTimes(city);
    } else {
      const hours = String(Math.floor(timeDiff / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, "0");
      setCountdown(`${hours}:${minutes}:${seconds}`);
    }
  }, [nextPrayer, city]);

  // Fetch prayer times when city changes
  useEffect(() => {
    fetchPrayerTimes(city);
  }, [city]);

  // Recalculate next prayer when prayer times update
  useEffect(() => {
    if (prayerTimes) {
      const next = calculateNextPrayer();
      setNextPrayer(next);
    }
  }, [prayerTimes, calculateNextPrayer]);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [updateCountdown]);

  return (
    <div className="App">
      <main className="container">
        <h1 className="text-center">مواقيت الصلاة</h1>
        <div className="form-group">
          <label htmlFor="city">اختر المدينة:</label>
          <br />
          <select
            id="city"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {[
              "Marrakech",
              "Casablanca",
              "Rabat",
              "Salé",
              "Fès",
              "Tanger",
              "Agadir",
              "Meknès",
              "Oujda",
              "Tetouan",
              "Al Hoceima",
              "Ouarzazate",
            ].map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <div className="text-center my-3">
              <p>الصلاة القادمة</p>
              <p>{nextPrayer?.name || "..."}</p>
              <p>الوقت المتبقي</p>
              <p>{countdown}</p>
            </div>
            <div className="prayer-times">
              {prayerOrder.map((prayer) => (
                <div key={prayer} className="d-flex justify-content-between my-2">
                  <span>{prayerTranslations[prayer]}</span>
                  <span>{prayerTimes?.[prayer] || "--:--"}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Prayer;
