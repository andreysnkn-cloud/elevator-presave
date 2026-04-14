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
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "30px",
          borderRadius: "12px",
          animation: "fadeIn 1.5s ease forwards",
          opacity: 0,
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Ваш билет</h2>

        <div
          style={{
            fontSize: "32px",
            letterSpacing: "4px",
            marginBottom: "20px",
          }}
        >
          {ticket || "..."}
        </div>

        <p style={{ opacity: 0.7 }}>
          Сохраните этот номер.
          <br />
          Он участвует в розыгрыше портрета.
        </p>

        <p style={{ marginTop: "20px", fontSize: "12px", opacity: 0.4 }}>
          Номер билета сохраняется только в вашем браузере.
        </p>
      </div>

      <style jsx global>{`
        html, body, #__next {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: black;
        }

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
}
