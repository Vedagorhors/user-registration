import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registrationFormSchema } from "./registration-form-schema";

import styles from "./app.module.css";
import { useRef } from "react";
import Field from "./components";

// React Hook Form сам отменяет стандартную отправку формы.
// Сначала валидирует по registrationSchema.
// Если всё ок, вызывает onSubmit(data).
// Если есть ошибки, заполняет errors и не вызывает onSubmit.

const App = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
	} = useForm({
		mode: "onBlur", // валидация срабатывает при blur и при submit
		resolver: yupResolver(registrationFormSchema), // подключаем Yup-схему
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const submitButtonRef = useRef(null);

	// Обработчик отправки формы

	// const onSubmit = (data) => {
	// 	// Объект data автоматически собирается по ключам name у полей.
	// 	console.log(data); // { email, password, confirmPassword }
	// 	if (submitButtonRef.current) {
	// 		submitButtonRef.current.focus();
	// 	}
	// };

	function onSubmit(data) {
		console.log(data); // { email, password, confirmPassword }
		const button = submitButtonRef.current;
		if (button) {
			button.focus();
		}
	}

	const fields = [
		{
			id: "email",
			name: "email",
			label: "Почта",
			type: "email",
			placeholder: "Введите email",
		},
		{
			id: "password",
			name: "password",
			label: "Пароль",
			type: "password",
			placeholder: "Введите пароль",
		},
		{
			id: "confirmPassword",
			name: "confirmPassword",
			label: "Повтор пароля",
			type: "password",
			placeholder: "Повторите пароль",
		},
	];

	return (
		<div className={styles.app}>
			<form
				className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
				// handleSubmit из useForm, а onSubmit — моя новая функция
			>
				{/* register={register} — передаём саму функцию регистрации.
				error={errors[field.name]?.message} — достаём текст ошибки для конкретного поля из formState.errors */}
				{fields.map((field) => (
					<Field
						key={field.id}
						{...field}
						register={register}
						error={errors[field.name]?.message}
					/>
				))}

				<div className={styles.actions}>
					<button
						className={styles.button}
						type="submit"
						// кнопка будет блокироваться при невалидной форме
						disabled={!isValid || isSubmitting}
						ref={submitButtonRef}
					>
						Зарегистрироваться
					</button>
				</div>
			</form>
		</div>
	);
};

export default App;
