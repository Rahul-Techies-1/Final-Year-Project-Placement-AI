import api from "../api/axios";


// ========================================================
// LOGIN USER
// ========================================================

export const loginUser = async ({
    email,
    password
}) => {

    const formData = new URLSearchParams();

    formData.append(
        "username",
        email
    );

    formData.append(
        "password",
        password
    );

    const response = await api.post(
        "/auth/login",
        formData,
        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data;
};


// ========================================================
// REGISTER USER
// ========================================================

export const registerUser = async (
    userData
) => {

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
};