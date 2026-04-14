import { useEffect, useState } from "react";

export default function TicketPage() {
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    // 1. Проверяем, есть ли уже билет
    const existingTicket = localStorage.getItem("ticket");

    if (existingTicket) {
      setTicket(existingTicket);
      return;
    }

    // 2. Генерируем новый билет
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const newTicket = `idst-${randomNumber}`;

    // 3. Сохраняем в localStorage
    localStorage.setItem("ticket", newTicket);
    setTicket(newTicket);

    // 4. Отправляем в базу (ОДИН раз)
    fetch("/api/save-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticket: newTicket }),
    }).catch(() => {
      // если ошибка — просто игнорируем (не ломаем UX)
    });

  }, []);

 return (
  <main
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "black",
      color: "white",
      fontFamily: "monospace",
    }}
  >
    <div
      style={{
        width: "320px",
        padding: "24px",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 1.5s ease forwards",
        opacity: 0,
      }}
    >
      <div style={{ fontSize: "12px", opacity: 0.6 }}>
        СИСТЕМА IDST
      </div>

      <div style={{ fontSize: "18px", marginBottom: "16px" }}>
        Посадочный талон
      </div>

      <div style={{ fontSize: "12px", opacity: 0.6 }}>
        ПАССАЖИР: ЗАРЕГИСТРИРОВАН
      </div>

      <div style={{ fontSize: "12px", opacity: 0.6 }}>
        МАРШРУТ: МУЗЫКА ДЛЯ ЛИФТА
      </div>

      <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "20px" }}>
        СТАТУС: ПОДТВЕРЖДЕН
      </div>

      <div
        style={{
          fontSize: "20px",
          letterSpacing: "2px",
          marginBottom: "20px",
        }}
      >
        {ticket || "..."}
      </div>

      <div style={{ fontSize: "11px", opacity: 0.4 }}>
        Посадка начнется после релиза
      </div>

      <button
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          background: "white",
          color: "black",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
        onClick={() => {
          window.print();
        }}
      >
        Сохранить билет
      </button>
    </div>

    <style jsx global>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </main>
);
