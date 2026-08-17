"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cloud, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const { configured, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    setBusy(true);
    const result = mode === "login" ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setBusy(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    if (result.needsEmailConfirmation) {
      setMessage({ type: "success", text: "Email tasdiqlash xati yuborildi. Tasdiqlagandan keyin tizimga kiring." });
      setMode("login");
    }
  }

  return (
    <main className="loginPage">
      <section className="loginVisual">
        <div className="loginBrand"><Image src="/mening-tizimim-logo.png" alt="Mening Tizimim" width={210} height={84} priority /></div>
        <div className="loginHeroCopy">
          <span className="loginEyebrow"><Cloud size={15} /> v0.3 · Personal Business OS</span>
          <h1>Ishlaringiz, mijozlaringiz va moliyangiz — bitta tizimda.</h1>
          <p>Yangi versiyada Supabase cloud baza, shaxsiy login, vazifalar va reminderlar ishlaydi.</p>
        </div>
        <div className="loginMetrics">
          <div><strong>01</strong><span>Private workspace</span></div>
          <div><strong>24/7</strong><span>Cloud access</span></div>
          <div><strong>1</strong><span>Markaziy tizim</span></div>
        </div>
      </section>

      <section className="loginFormSide">
        <div className="loginCard">
          {!configured ? (
            <>
              <div className="loginIcon"><LockKeyhole size={22} /></div>
              <h2>Cloud login hali sozlanmagan</h2>
              <p className="loginIntro"><code>.env.local</code> ichiga Supabase URL va anon key qo‘shilgach login avtomatik faollashadi. Hozir local demo ishlaydi.</p>
              <Link href="/" className="primaryButton loginSubmit">Local tizimga kirish <ArrowRight size={17} /></Link>
              <div className="loginHint">Setup uchun <b>README.md</b> va <b>supabase/schema.sql</b> tayyor.</div>
            </>
          ) : (
            <>
              <div className="loginIcon"><LockKeyhole size={22} /></div>
              <h2>{mode === "login" ? "Tizimga kirish" : "Admin akkaunt yaratish"}</h2>
              <p className="loginIntro">Mening Tizimim shaxsiy workspace’iga xavfsiz kirish.</p>

              <div className="loginTabs">
                <button className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setMessage(null); }}>Kirish</button>
                <button className={mode === "signup" ? "selected" : ""} onClick={() => { setMode("signup"); setMessage(null); }}>Account yaratish</button>
              </div>

              <form className="loginForm" onSubmit={submit}>
                <label className="loginField">
                  <span>Email</span>
                  <div><Mail size={17} /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></div>
                </label>
                <label className="loginField">
                  <span>Parol</span>
                  <div><LockKeyhole size={17} /><input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kamida 6 ta belgi" autoComplete={mode === "login" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Parolni ko‘rsatish">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
                </label>
                {message && <div className={`loginMessage ${message.type}`}>{message.text}</div>}
                <button className="primaryButton loginSubmit" disabled={busy}>{busy ? "Kutilmoqda..." : mode === "login" ? "Kirish" : "Account yaratish"}<ArrowRight size={17} /></button>
              </form>
              <div className="loginHint">Birinchi admin account yaratilgach Supabase’da yangi signup’larni o‘chirib qo‘yish tavsiya etiladi.</div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
