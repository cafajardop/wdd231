export async function fetchHabits() {
    try {
        const res = await fetch("data/habits.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return await res.json();
    } catch (err) {
        return { error: true, message: "Could not load habits data." };
    }
}
