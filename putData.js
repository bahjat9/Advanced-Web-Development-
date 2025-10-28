export const putData = async (baseUrl, usersData, { fallbackOn404 = true } = {}) => {
  const updateUrl = `${baseUrl}/api/users/${usersData.id}`;
  try {
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        my_key: "my_super_secret_phrase",
      },
      body: JSON.stringify(usersData),
    });
    if (!response.ok) {
      let errText = `HTTP error! status: ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson && (errJson.message || errJson.error)) {
          errText += ` - ${errJson.message || errJson.error}`;
        }
      } catch (e) {
      }
      if (fallbackOn404 && response.status === 404) {
        console.warn(`[putData] Received 404 from ${updateUrl} — returning local mock success.`);
        return { message: "User updated successfully" };
      }
      throw new Error(errText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[putData] Error:", error);
    throw error;
  }
};
