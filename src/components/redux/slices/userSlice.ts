import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const loadUsers = () => {
  try {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: any[]) => {
  try {
    localStorage.setItem("users", JSON.stringify(users));
  } catch (error) {
    console.error("Failed to save users", error);
  }
};



interface Todo {
  title: string;
  description: string;
  priority: string;
  category: string;
  dueDate: string;
  reminder: boolean;
  tag: string;
}

interface UserState {
  users: Todo[];
}

const initialState: UserState = {
  users: loadUsers(),
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.users.push(action.payload);
      saveUsers(state.users);
    },

    updateUser: (state, action) => {
      const { index, data } = action.payload;
      state.users[index] = data;
      saveUsers(state.users);
    },

    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(
        (_:Todo, index:number) => index !== action.payload
      );
      saveUsers(state.users);
    },
  },
});


export const { getUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;