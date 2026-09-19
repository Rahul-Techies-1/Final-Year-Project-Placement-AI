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

export const registerUser = async ({
    full_name,
    email,
    password,
    role
}) => {

    const response = await api.post(
        "/auth/register",
        {
            full_name,
            email,
            password,
            role
        }
    );

    return response.data;
};