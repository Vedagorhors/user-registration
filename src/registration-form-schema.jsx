import * as yup from "yup";

export const registrationFormSchema = yup.object({
	email: yup
		.string()
		// required(...) — метод схемы Yup.string(), который добавляет проверку: значение не должно быть пустым (не undefined, не null и не пустая строка)
		.required("Email не может быть пустым.")
		.email("Неверный формат email.")
		.matches(/^\S+@\S+\.[a-zA-Z]{2,6}$/, "Неверный формат email."),
	password: yup
		.string()
		.required("Пароль обязателен. Поле не должно быть пустым.")
		.matches(/^\S+$/, "Пароль не должен содержать пробелов.")
		.min(6, "Неверный пароль. Должно быть не менее 6 символов."),
	confirmPassword: yup
		.string()
		.required("Повтор пароля обязателен. Поле не должно быть пустым.")
		// поле confirmPassword может быть null. null задается для того, чтобы пустое поле ошибку не выкидывало
		// и поле должно ссылаться на password (yup.ref("password")), где ref  - это ссылка от yup своя
		// Правило: confirmPassword должно совпадать с password
		// yup.ref("password") — ссылка на поле password из схемы объекта
		// oneOf укажет ошибку, если confirmPassword не равно password
		.oneOf([yup.ref("password"), null], "Пароль не совпадает!"),
});
