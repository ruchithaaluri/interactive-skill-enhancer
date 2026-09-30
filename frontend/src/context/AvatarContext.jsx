import { createContext, useState, useEffect } from "react";
import { AVATAR_CONFIGS, DEFAULT_AVATAR_ID } from "../config/avatarConfig";

export const AvatarContext = createContext();

export function AvatarProvider({ children }) {
  const [selectedAvatarId, setSelectedAvatarId] = useState(() => {
    return localStorage.getItem("selected_avatar_id") || DEFAULT_AVATAR_ID;
  });

  const selectedAvatar = AVATAR_CONFIGS[selectedAvatarId] || AVATAR_CONFIGS[DEFAULT_AVATAR_ID];

  useEffect(() => {
    localStorage.setItem("selected_avatar_id", selectedAvatarId);
  }, [selectedAvatarId]);

  const selectAvatar = (avatarId) => {
    if (AVATAR_CONFIGS[avatarId]) {
      setSelectedAvatarId(avatarId);
    }
  };

  return (
    <AvatarContext.Provider
      value={{
        selectedAvatarId,
        selectedAvatar,
        selectAvatar,
        avatarConfigs: AVATAR_CONFIGS,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}
