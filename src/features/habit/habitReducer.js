import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, doc, updateDoc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../../firebaseinit";
const INITIAL_STATE = {
    habits: [],
    loading: false,
    error: null

}

const updateStatuses = (storedStatuses) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const latestStoredDate = storedStatuses[storedStatuses.length - 1].date;
    const latestDate = new Date(latestStoredDate);

    // If today's date is already the latest stored date, no need to update
    if (todayDateString === latestStoredDate) {
        return storedStatuses;
    }

    const updatedStatuses = [...storedStatuses];

    // Add missing days between the latest stored date and today
    let currentDate = new Date(latestDate);
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day

    while (currentDate <= today) {
        const dateString = currentDate.toISOString().split('T')[0];
        const dayString = dayNames[currentDate.getDay()];

        updatedStatuses.push({ date: dateString, day: dayString, status: 'none' });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Remove the oldest date if there are more than 7 statuses
    if (updatedStatuses.length > 7) {
        updatedStatuses.shift();
    }

    return updatedStatuses;
};



const calculateStreaks = (statuses) => {
    let currentStreak = 0;
    let bestStreak = 0;
    let totalDays = 0;

    for (let i = 0; i < statuses.length; i++) {
        if (statuses[i].status === 'done') {
            currentStreak++;
            totalDays++;
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
            }
        } else {
            currentStreak = 0; // Reset current streak when an undone status is found
        }
    }

    return { currentStreak, bestStreak, totalDays };
};




export const changeStatusAsync = createAsyncThunk('change/status', async (payload, { rejectWithValue }) => {
    
    try {
        const { habitId, status, date } = payload;
        // Retrieve the habit document from Firestore
        const habitRef = doc(db, "habits", habitId);
        const habitDoc = await getDoc(habitRef);

        if (habitDoc.exists()) {
            const habitData = habitDoc.data();
            const updatedStatuses = habitData.statuses.map((statusItem) => {
                // Find the array item with the matching date
                if (statusItem.date === date) {
                    return { ...statusItem, status }; // Update the status
                }
                return statusItem;
            });
            const { currentStreak, bestStreak, totalDays } = calculateStreaks(updatedStatuses);

            // Update the Firestore document with the modified statuses array
            await updateDoc(habitRef, { 
                statuses: updatedStatuses, 
                currentStreak, 
                bestStreak, 
                totalDays 
            });

            return { habitId, status, date, currentStreak, bestStreak, totalDays };
        } else {
            throw new Error("Habit document not found");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }


});

export const updateFavoriteAsync = createAsyncThunk(
    'habit/updateFavorite',
    async ({ id, fav }, { rejectWithValue }) => {
      try {
        await updateDoc(doc(db, "habits", id), {
          fav: fav
        });
        return { id, fav };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );



export const addHabitAsync = createAsyncThunk('habit/add', async (payload, { rejectWithValue }) => {
    try {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date().toISOString().split('T')[0]
        const day = new Date().getDay();
        const dayString = dayNames[day];

        const { title, schedule } = payload;
         // Convert schedule time to AM/PM format
         const scheduleTime = new Date(`1970-01-01T${schedule}:00`);
         const formattedSchedule = scheduleTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const docRef = await addDoc(collection(db, "habits"), {
            title,
            schedule:formattedSchedule,
            createdAt: new Date().toISOString(),
            statuses: [{ date: date, day: dayString, status: 'none' }],
            fav: false,
            currentStreak: 0,
            bestStreak: 0,
            totalDays: 0
        });

        return { id: docRef.id, title, schedule, statuses: [{ date: date, day: dayString, status: 'none' }], fav: false, currentStreak: 0, bestStreak: 0, totalDays: 0 };

    } catch (error) {
        return rejectWithValue(error.message);
    }

})

export const fetchAndUpdateAllHabits = createAsyncThunk(
    'habit/fetchAndUpdateAll',
    async (_, { rejectWithValue }) => {
        try {
            const querySnapshot = await getDocs(collection(db, "habits"));
            const batchUpdates = querySnapshot.docs.map(async (habitDoc) => {
                const habitData = { ...habitDoc.data(), id: habitDoc.id };
                const updatedStatuses = updateStatuses(habitData.statuses);

                if (JSON.stringify(updatedStatuses) !== JSON.stringify(habitData.statuses)) {
                    const { currentStreak, bestStreak, totalDays } = calculateStreaks(updatedStatuses);
                    await updateDoc(doc(db, "habits", habitDoc.id), { statuses: updatedStatuses, currentStreak, bestStreak, totalDays });
                    return { id: habitDoc.id, ...habitData, statuses: updatedStatuses, currentStreak, bestStreak, totalDays };
                }

                return { id: habitDoc.id, ...habitData, statuses: updatedStatuses };
            });

            const updatedHabits = await Promise.all(batchUpdates);

            return updatedHabits;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const habitSlice = createSlice({
    name: 'habit',
    initialState: INITIAL_STATE,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addHabitAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(addHabitAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.habits.push(action.payload);
            })
            .addCase(addHabitAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAndUpdateAllHabits.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAndUpdateAllHabits.fulfilled, (state, action) => {
                state.loading = false;
                state.habits = (action.payload);

            })
            .addCase(fetchAndUpdateAllHabits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(changeStatusAsync.fulfilled, (state, action) => {
                const { habitId, status, date, currentStreak, bestStreak, totalDays } = action.payload;
                const habitIndex = state.habits.findIndex((habit) => habit.id === habitId);

                if (habitIndex !== -1) {
                    const habit = state.habits[habitIndex];
                    const statusIndex = habit.statuses.findIndex((statusItem) => statusItem.date === date);

                    if (statusIndex !== -1) {
                        state.habits[habitIndex].statuses[statusIndex].status = status;
                        state.habits[habitIndex].currentStreak = currentStreak;
                        state.habits[habitIndex].bestStreak = bestStreak;
                        state.habits[habitIndex].totalDays = totalDays;
                    }
                }
            })
            .addCase(changeStatusAsync.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
            .addCase(updateFavoriteAsync.fulfilled, (state, action) => {
                const { id, fav } = action.payload;
                const habitToUpdate = state.habits.find(habit => habit.id === id);
                if (habitToUpdate) {
                  habitToUpdate.fav = fav;
                }
              });
    }
})

export const habitReducer = habitSlice.reducer;
export const habitSelector = (state) => state.habitReducer;