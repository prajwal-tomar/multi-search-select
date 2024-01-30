import React, { useRef, useState } from "react";
import "./App.css";
import { useEffect } from "react";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersSet, setSelectedUsersSet] = useState(new Set());
  const inputRef = useRef();

  const fetchUserDetails = () => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }
    fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setSuggestions(result);
      })
      .catch((err) => console.log(err));
  };

  // I want to call the API every time the search term changes so that the fetching is in real time.
  useEffect(() => {
    fetchUserDetails();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    // Populate the set as well with the selected user
    setSelectedUsersSet(new Set([...selectedUsersSet, user.id]));
    setSearchTerm("");
    setSuggestions([]);
    // put the cursor on the input automatically
    inputRef.current.focus();
  };

  const handleRemove = (x) => {
    // return all the users who's id is not equal to the id of the user that has been passed.
    const remainingUsers = selectedUsers.filter((user) => user.id !== x.id);
    setSelectedUsers(remainingUsers);
    const remainingUsersSet = new Set(selectedUsersSet);
    remainingUsersSet.delete(x.id);
    setSelectedUsersSet(remainingUsersSet);
  };

  const handleKeydown = (e) => {
    if (
      e.key === "Backspace" &&
      selectedUsers.length > 0 &&
      searchTerm === ""
    ) {
      console.log("Inside handleKeyDown method");
      let lastSelectedUser = selectedUsers[selectedUsers.length - 1];
      handleRemove(lastSelectedUser);
    }
  };

  return (
    <div className=" mx-40">
      <h1 className="mt-28 text-lg">Multi Search Select</h1>
      <div className="search-bar border-black border-[1px] h-20 flex items-center relative rounded-lg">
        <div className="flex gap-2 m-1 ms-5">
          {selectedUsers?.map((user) => (
            <p
              className="bg-black text-white rounded-lg p-2 text-sm"
              key={user.id}
              onClick={() => handleRemove(user)}
            >
              {`${user.firstName}`}
            </p>
          ))}
        </div>
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          className="w-[100%] p-2 outline-none"
          onKeyDown={handleKeydown}
          ref={inputRef}
        />
      </div>
      <div>
        <ul className="bg-slate-200 w-80 max-h-52 overflow-y-auto">
          {suggestions &&
            suggestions?.users?.map((user, index) =>
              !selectedUsersSet?.has(user.id) ? (
                <li
                  className="flex items-center p-2 gap-2 border-b-[1px] border-black hover: cursor-pointer"
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                >
                  <img src={user.image} alt={user.firstName} className="w-10" />
                  <span>{`${user.firstName} ${user.lastName}`}</span>
                </li>
              ) : (
                <></>
              )
            )}
        </ul>
      </div>
    </div>
  );
};

export default App;
