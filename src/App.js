import React, { useState, useEffect } from "react";
import './App.css';

const App = () => {
  const [city, setCity] = useState("Marrakech");
  const [prayerTimes, setPrayerTimes] = useState({});
  const [nextPrayer, setNextPrayer] = useState({});
  const [countdown, setCountdown] = useState("--:--:--");

  const prayerTranslations = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  };

  const fetchPrayerTimes = async (selectedCity) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity}&country=Morocco&method=4`
      );
      const data = await response.json();
      setPrayerTimes(data.data.timings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      alert("Error fetching prayer times. Please check your internet connection.");
    }
  };

  const calculateNextPrayer = () => {
    const now = new Date();
    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    for (const prayer of prayerOrder) {
      const [hour, minute] = prayerTimes[prayer]?.split(":") || [0, 0];
      const prayerTime = new Date();
      prayerTime.setHours(Number(hour), Number(minute), 0, 0);

      if (now < prayerTime) {
        return { time: prayerTime, name: prayerTranslations[prayer] };
      }
    }

    // If all prayers have passed, set next to Fajr the next day
    const [fajrHour, fajrMinute] = prayerTimes.Fajr.split(":").map(Number);
    const nextDayFajr = new Date();
    nextDayFajr.setDate(now.getDate() + 1);
    nextDayFajr.setHours(fajrHour, fajrMinute, 0, 0);

    return { time: nextDayFajr, name: prayerTranslations.Fajr };
  };

  const updateCountdown = () => {
    if (!nextPrayer?.time) return;

    const now = new Date();
    const timeDiff = nextPrayer.time - now;

    if (timeDiff <= 0) {
      fetchPrayerTimes(city);
    } else {
      const hours = String(Math.floor(timeDiff / (1000 * 60 * 60))).padStart(2, "0");
      const minutes = String(
        Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");
      const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, "0");
      setCountdown(`${hours}:${minutes}:${seconds}`);
    }
  };

  useEffect(() => {
    fetchPrayerTimes(city);
  }, [city]);

  useEffect(() => {
    if (Object.keys(prayerTimes).length > 0) {
      const next = calculateNextPrayer();
      setNextPrayer(next);
    }
  }, [prayerTimes]);

  useEffect(() => {
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nextPrayer]);

  return (
    <div className="App">
      <main className="container">
      <h1 className="text-center">مواقيت الصلاة</h1>
        <div className="form-group">
          <label htmlFor="city">اختر المدينة:</label><br></br>
          <select
            id="city"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="Marrakech">مراكش</option>
            <option value="Casablanca">الدار البيضاء</option>
            <option value="Rabat">الرباط</option>
            <option value="Salé">سلا</option>
            <option value="Fès">فاس</option>
            <option value="Tanger">طنجة</option>
            <option value="Agadir">أكادير</option>
            <option value="Meknès">مكناس</option>
            <option value="Oujda">وجدة</option>
            <option value="Tetouan">تطوان</option>
            <option value="Al Hoceima">الحسيمة</option>
            <option value="Ouarzazate">ورزازات</option>
          </select>
        </div>

        <div className="text-center my-3">
          <p>الصلاة القادمة</p>
          <p> {nextPrayer.name || "..."}</p>
          <p>الوقت المتبقي</p>
          <p>{countdown}</p>
        </div>

        <div className="prayer-times">
          {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => (
            <div key={prayer} className="d-flex justify-content-between my-2">
              <span>{prayerTranslations[prayer]}</span>
              <span>{prayerTimes[prayer] || "--:--"}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
