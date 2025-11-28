import axios from "axios";
import { transformResult, transformExaminers } from "../helpers/helpers";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const getAllResults = async () => {
  try {
    const response = await api.get(`/result/get`);
    if (!response) {
      console.log("Error, API");
    }

    console.log(response.data.data);

    const formatted = response.data.data.map(transformResult);

    return formatted;
  } catch (error) {
    console.error(error);
    toast.error(error);
  }
};

export const getAllExaminers = async () => {
  try {
    const response = await api.get(`/examiner/get`);

    if (!response) {
      console.log("Failed to fetch data!");
    }

    const formattedData = response.data.data.map(transformExaminers);

    return formattedData;
  } catch (error) {
    console.error(error);
    toast.error(error);
  }
};

export const getAllDepartments = async () => {
  try {
    const response = await api.get(`/department/get`);

    if (!response) {
      console.log("Cannot fetch departments!");
    }
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    toast.error(error);
  }
};

export const toggleDepartmentActiveStatus = async (department) => {
  try {
    await api.patch(`/department/toggle-status/${department.dept_id}`, {
      is_active: !department.is_active,
    });
  } catch (error) {
    console.error(error);
    toast.error(error);
  }
};

export const addDepartment = async (newDeptName) => {
  try {
    await api.post(`/department/create`, {
      dept_name: newDeptName,
      is_active: true,
    });
  } catch (error) {
    console.error(error);
    toast.error(error);
  }
};

export const editDepartment = async (editingDept) => {
  try {
    await api.put(`/department/update/${editingDept.dept_id}`, {
      dept_name: editingDept.dept_name,
    });
  } catch (error) {
    console.error(error);
    toast.error(error);
  }
};

export const deleteDepartment = async (deletingDept) => {
  try {
    await api.delete(`/department/delete/${deletingDept.dept_id}`);
  } catch (error) {
    console.error(error);
    toast.error(error);
  }
};

export const submitResults = async ({ results, examinerId }) => {
  try {
    const body = {
      quiz_id: quiz_id,
      examiner_id: examinerId,
      answers: [
        {
          question_id: question_id,
          answer_id: answer_id,
        },
      ],
      status: "COMPLETED",
    };

    await api.post("url", body);
  } catch (err) {
    console.error(err);
  }
};

export const addQuestion = async (quizId, payload) => {
  try {
    const res = await api.post(`/question/${quizId}/create`, payload);

    return { ...res.data.data };
  } catch (err) {
    console.error(err);
  }
};

export const getQuestions = async (quizId) => {
  try {
    const response = await api.get(`/question/get/${quizId}`);
    return response.data.data || [];
  } catch (err) {
    console.error(err);
  }
};

export const updateQuestion = async (quizId, questionId, payload) => {
  try {
    await api.put(`/question/${quizId}/update/${questionId}`, payload);
  } catch (err) {
    console.error(err);
  }
};

export const deleteQuestion = async (quizId, questionId) => {
  try {
    await api.delete(`/question/${quizId}/delete/${questionId}`);
  } catch (err) {
    console.error(err);
  }
};

export const getOptions = async (quizId) => {
  try {
    const response = await api.get(`/answer/test/${quizId}`);
    return response.data.data || [];
  } catch (err) {
    console.error(err);
  }
};

export const getAnswers = async (quizId) => {
  try {
    const res = await api.get(`/answer/get/${quizId}`);

    return res.data.data || [];
  } catch (err) {
    console.error(err);
  }
};

export const updateAnswer = async (answerId, options) => {
  try {
    await api.put(`/answer/${answerId}/update`, options);
  } catch (err) {
    console.error(err);
  }
};

export const addAnswer = async (questionId, options) => {
  try {
    await api.post(`/answer/${questionId}/create`, options);
  } catch (err) {
    console.error(err);
  }
};

export const deleteAnswer = async (oldId) => {
  try {
    await api.delete(`/answer/${oldId}/delete`);
  } catch (err) {
    console.error(err);
  }
};

export const addResult = async (payload) => {
  try {
    const headers = { headers: { "Content-Type": "application/json" } };
    const response = await api.post(
      `${API_BASE_URL}/result/create`,
      payload,
      headers
    );

    return response.data.data || [];
  } catch (err) {
    console.error(err);
  }
};

export const addBridge = async (payload) => {
  try {
    const headers = { headers: { "Content-Type": "application/json" } };
    await api.post(`/bridge/create`, payload, headers);
  } catch (err) {
    console.error(err);
  }
};

export const getQuizzes = async (deptId) => {
  try {
    const response = await api.get(`/quiz/get/${deptId}`);

    return response.data.data || [];
  } catch (err) {
    console.error(err);
  }
};

export const addQuiz = async (deptId, payload) => {
  try {
    await api.post(`/quiz/${deptId}/create`, payload);
  } catch (err) {
    console.error(err);
  }
};

export const editQuiz = async (deptId, quizId, payload) => {
  try {
    await api.put(`${API_BASE_URL}/quiz/${deptId}/update/${quizId}`, payload);
  } catch (err) {
    console.error(err);
  }
};

export const deleteQuiz = async (deptId, quizId) => {
  try {
    await api.delete(`/quiz/${deptId}/delete/${quizId}`);
  } catch (err) {
    console.error(err);
  }
};

export const generateInviteLink = async (payload) => {
  try {
    const link = await api.post(`/invitation/generate`, payload);

    return link.data.data.link || "";
  } catch (err) {
    console.error(err);
  }
};

export const validateInvitationLink = async (token) => {
  try {
    const response = await api.get(`/invitation/validate/${token}`);

    const status = response.status;

    return { ...response.data.data, status };
  } catch (err) {
    console.error(err);
  }
};

export const submitExaminerData = async (payload) => {
  try {
    const response = await api.post(`/invitation/complete`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log(response);
    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};

export const submitAbandonTest = async (payload) => {
  try {
    await api.post(`/result/create`, payload);
  } catch (err) {
    console.error(err);
  }
};

export const deleteExamineeAttempt = async(examinee_id) => {
  try {
    await api.delete(`/examiner/delete/${examinee_id}`)
  } catch (err) {
    console.error(err)
  }
}
export const deleteExamineeTestResult = async(attempt_id) => {
  try {
    await api.delete(`/result/delete/${attempt_id}`)
  } catch (err) {
    console.error(err)
  }
}