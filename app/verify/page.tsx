type VerifyProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getOne(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value || "";
}

export default async function VerifyPage({ searchParams }: VerifyProps) {
  const params = (await searchParams) || {};
  const doc = getOne(params.doc);
  const number = getOne(params.number);
  const date = getOne(params.date);
  const business = getOne(params.business);

  return (
    <main style={{ minHeight: "100vh", background: "#f4f8fb", padding: "32px 16px", color: "#102d4b" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", border: "1px solid #dbe8f2", borderRadius: 20, boxShadow: "0 12px 35px rgba(26,74,112,.08)", overflow: "hidden" }}>
        <div style={{ padding: "22px 24px", borderBottom: "1px solid #e4eef6", background: "linear-gradient(135deg,#f7fbff,#eef7ff)" }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: '#1594f6' }}>MENING TIZIMIM • DOCUMENT VERIFY</div>
          <h1 style={{ margin: '8px 0 0', fontSize: 28 }}>Hujjatni tekshirish</h1>
          <p style={{ margin: '8px 0 0', color: '#5f7488' }}>Bu sahifa Mening Tizimim orqali yaratilgan hujjat identifikatorini ko‘rsatadi. Raqamlarni asl PDF yoki Word nusxadagi ma’lumot bilan solishtiring.</p>
        </div>
        <div style={{ padding: 24, display: 'grid', gap: 14 }}>
          <VerifyRow label="Document ID" value={doc || 'Topilmadi'} strong />
          <VerifyRow label="Shartnoma raqami" value={number || 'Kiritilmagan'} />
          <VerifyRow label="Shartnoma sanasi" value={date || 'Kiritilmagan'} />
          <VerifyRow label="Brend / biznes" value={business || 'Kiritilmagan'} />
        </div>
        <div style={{ padding: '0 24px 24px', color: '#4e6477', fontSize: 14, lineHeight: 1.6 }}>
          <p><strong>Eslatma:</strong> bu ichki elektron tekshiruv sahifasi. Hujjat haqiqiy hisoblanishi uchun undagi Document ID, shartnoma raqami, sana va brend nomi aynan shu sahifadagi ma’lumot bilan mos kelishi kerak.</p>
        </div>
      </div>
    </main>
  );
}

function VerifyRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ border: '1px solid #e5edf5', borderRadius: 14, padding: '14px 16px', background: '#fbfdff' }}>
      <div style={{ fontSize: 12, color: '#678099', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: strong ? 20 : 16, fontWeight: strong ? 800 : 600, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}
