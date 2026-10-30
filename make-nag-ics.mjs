// Builds app/nag.ics: daily recurring reminders with an alarm at event time.
//   node make-nag-ics.mjs
import fs from "node:fs";
const APP = "https://shay-glitch.github.io/";
const items = [];
const add = (hhmm, title, body, q = "", rrule = "FREQ=DAILY") => items.push({ hhmm, title, body, q, rrule });

add("0730", "שקילה", "לפני אוכל, אחרי שירותים. תרשום באפליקציה.", "", "FREQ=WEEKLY;BYDAY=FR");
add("0800", "כוס מים ראשונה", "לפני הקפה. לחץ כדי לרשום.", "?water=1");
add("0830", "ארוחת בוקר: חלבון", "ביצים, יוגורט או גבינה. לא מאפה.", "?meal=0");
for (let h = 9; h <= 20; h++) {
  const hh = String(h).padStart(2, "0");
  if (h === 13) add("1300", "צהריים + כוס מים", "חלבון וירק. וכוס מים לפני.", "?meal=1");
  else add(hh + "00", "כוס מים", ["קום. כוס מים. עכשיו.", "עוד כוס. 3 ליטר זה היעד.", "רעב? קודם מים."][h % 3], "?water=1");
}
for (const t of ["1030", "1330", "1630", "1930"]) add(t, "15 דקות הליכה", "1,500 צעדים לכיוון 90. שיחת הטלפון הבאה בהליכה.");
add("1830", "ארוחת ערב", "אחרונה להיום. חלבון וירק.", "?meal=2");
add("2100", "המטבח סגור", "רק מים מעכשיו. בלי משא ומתן.");
add("2200", "הטלפון מחוץ לחדר", "נטען בסלון. בלי מסכים.");

const esc = s => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//shay-health//nag//HE", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
  "X-WR-CALNAME:שי בריאות", "X-WR-TIMEZONE:Asia/Jerusalem", "REFRESH-INTERVAL;VALUE=DURATION:PT12H"];
items.sort((a, b) => a.hhmm.localeCompare(b.hhmm)).forEach((it, i) => {
  const end = String(+it.hhmm.slice(2) + 5).padStart(2, "0");
  L.push("BEGIN:VEVENT", `UID:shay-health-${it.hhmm}-${i}@shay-glitch.github.io`, "DTSTAMP:20261030T120000Z",
    `DTSTART:20261031T${it.hhmm}00`, `DTEND:20261031T${it.hhmm.slice(0, 2)}${end}00`, `RRULE:${it.rrule}`,
    `SUMMARY:${esc(it.title)}`, `DESCRIPTION:${esc(it.body + " " + APP + it.q)}`, `URL:${APP}${it.q}`, "TRANSP:TRANSPARENT",
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(it.title)}`, "TRIGGER:PT0M", "END:VALARM", "END:VEVENT");
});
L.push("END:VCALENDAR");
fs.writeFileSync(new URL("./app/nag.ics", import.meta.url), L.join("\r\n") + "\r\n");
console.log(items.length + " daily reminders written to app/nag.ics");
