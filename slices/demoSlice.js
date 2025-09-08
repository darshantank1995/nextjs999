import { createSlice, nanoid } from "@reduxjs/toolkit";

const demoSlice = createSlice({
  name: "demo",
  initialState: {
    users: [],
  },
  reducers: {
    addUser: (state, action) => {
      console.log(action);
      const data = {
        id: nanoid(),
        name: action.payload, // <- use payload
      };
      state.users.push(data);
    },
  },
});

export const { addUser } = demoSlice.actions;
export default demoSlice.reducer;
