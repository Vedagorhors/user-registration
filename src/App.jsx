import styles from "./app.module.css/";
import { useState, useRef } from "react";
import Field from "./components";

const App = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [errorEmail, setErrorEmail] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

	// Cостояние (стэйт) для общей валидности формы не буду использовать - почему, описал ниже:
	// const [isFormValid, setIsFormValid] = useState(false);

	const [emailTouched, setEmailTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
	// булево состояние (true/false), которое показывает, взаимодействовал ли пользователь с полем email (то есть "потрогал" ли он поле, например, фокус был на поле и ушёл с него). Это нужно, чтобы не показывать ошибку сразу при загрузке формы, а только после того, как пользователь начал ввод и ушёл из поля. emailTouched управляет видимостью ошибки в зависимости от взаимодействия пользователя с полем. Если поле "потрогано", то true, а если нет, то false
	// emailTouched = true - это означает, что поле email было «потрогано» пользователем, то есть пользователь сфокусировался на поле ввода email и ушёл с него (событие "blur"). Этот флаг нужен, чтобы ошибок валидации не показывать сразу при загрузке формы, а только после взаимодействия с полем.

	const submitButtonRef = useRef(null);

	// Обработчики изменения значений
	// onChange отвечает за обновление значения и ошибки
	const handleChangeEmail = (event) => {
		const value = event.target.value;
		setEmail(value);
		// показываем ошибку только если поле уже трогали
		if (emailTouched) {
			setErrorEmail(validateEmail(value));
		} else {
			setErrorEmail(""); // пока не трогали поле, ошибку не показываем
		}
	};

	const handleChangePassword = (event) => {
		const value = event.target.value;
		setPassword(value);
		if (passwordTouched) {
			setErrorPassword(validatePassword(value));
		} else {
			setErrorPassword("");
		}
	};

	const handleChangeConfirmPassword = (event) => {
		const value = event.target.value;
		setConfirmPassword(value);
		// Для confirmPassword функция валидации получает сразу два аргумента: текущий пароль и подтверждение, потому что им нужно совпасть.
		if (confirmPasswordTouched) {
			setErrorConfirmPassword(validateConfirmPassword(password, value));
		} else {
			setErrorConfirmPassword("");
		}

		const error = validateConfirmPassword(password, value);
		setErrorConfirmPassword(error);
	};

	// Обработчик handleBlur... используется для запуска валидации email именно в момент ухода пользователя из поля ввода и тогда пользователь не видит ошибки при каждом вводимом символе, а только после того, как завершил ввод или переключился на другое поле или элемент страницы.
	// Обработчики потери фокуса

	// onBlur отвечает только за то, “показывать ли” ошибку пользователю. Только ставит флаг touched
	const handleBlurEmail = () => {
		setEmailTouched(true);
		// сразу проверяем введённый email
		setErrorEmail(validateEmail(email));
	};

	const handleBlurPassword = () => {
		setPasswordTouched(true);
		setErrorPassword(validatePassword(password));
	};

	const handleBlurConfirmPassword = () => {
		setConfirmPasswordTouched(true);
		setErrorConfirmPassword(
			validateConfirmPassword(password, confirmPassword)
		);
	};

	// Обработчик отправки формы
	const handleSubmit = (event) => {
		event.preventDefault();

		// Выставляю все touched в true, чтобы ошибки точно были видны
		setEmailTouched(true);
		setPasswordTouched(true);
		setConfirmPasswordTouched(true);

		// Пересчитываю ошибки
		const emailError = validateEmail(email);
		const passwordError = validatePassword(password);
		const confirmPasswordError = validateConfirmPassword(
			password,
			confirmPassword
		);

		setErrorEmail(emailError);
		setErrorPassword(passwordError);
		setErrorConfirmPassword(confirmPasswordError);

		// Проверяю, есть ли хоть одна ошибка
		const hasErrors = emailError || passwordError || confirmPasswordError;

		// 4. если ошибок нет — вывести данные и подготовиться к фокусу на кнопке
		if (!hasErrors) {
			console.log({ email, password, confirmPassword });
			if (submitButtonRef.current) {
				submitButtonRef.current.focus();
			}
		}
	};

	// Тут будет дальнейшая логика финальной проверки и отправки

	// Пояснение: В функции validateEmail(email) переменная email обозначает просто значение, которое нужно проверить на корректность. В обработчике handleChangeEmail значение поля приходит как e.target.value, потому что обработчик события получает объект события (event), а внутри этого объекта свойство .target — это сам HTML-элемент (input), а .value — его текущее значение.
	// При валидации: читаем текущее значение email из состояния и передаём функции для проверки.
	// В обработчике: берём новое значение из поля (e.target.value) и записываем в состояние email.

	// Создаю константу, в которую записываю регулярное выражение для проверки валидности email:
	const emailRegex = /^\S{1,}@\S{1,}\.[a-zA-Z]{2,6}$/;

	const validateEmail = (email) => {
		if (!email) {
			return "Email не может быть пустым.";
		} else if (!emailRegex.test(email)) {
			return "Неверный формат email.";
		} else {
			return "";
		}
	};

	const validatePassword = (password) => {
		// Проверка на пустое значение
		if (!password.trim()) {
			return "Пароль обязателен. Поле не должно быть пустым.";
			// Запрет на использование пробелов в пароле, то есть, если есть пробел, то ошибка
		} else if (!/^\S+$/.test(password)) {
			return "Пароль не должен содержать пробелов.";
			// Проверка на минимальную длину
		} else if (password.length < 6) {
			return "Неверный пароль. Должно быть не менее 6 символов.";
		} else {
			return "";
		}
	};

	const validateConfirmPassword = (password, confirmPassword) => {
		// Проверка на пустое значение
		if (!confirmPassword.trim()) {
			return "Повтор пароля обязателен. Поле не должно быть пустым.";
		} else if (password !== confirmPassword) {
			return "Пароль не совпадает!";
		} else {
			return "";
		}
	};

	// Проверка валидности всей формы. Если все функции проверки полей на валидность выдали true, то есть все поля валидны и нет ошибок, то тогда и вся форма регистрации валидна и равна true. В кнопке "Зарегестрироваться" у нас есть параметр disabled, который делает кнопку неактивной. Чтобы она была неактивна, вся форма должна быть false, поэтому в кнопке мы пишем !isFormValid
	// Поскольку валидность формы полностью зависит от:
	// значений полей (email, password, confirmPassword),
	// и строк ошибок (errorEmail, errorPassword, errorConfirmPassword),
	// проще и чище вычислять isFormValid прямо “на лету” при рендере, а не хранить в отдельном useState. Такой подход рекомендуют, когда значение можно однозначно вывести из существующего состояния.
	// То есть вместо:
	// const [isFormValid, setIsFormValid] = useState(false);
	// делаем просто переменную.

	// Переменная isFormValid проверяет, что строки ошибок пустые и учитывает заполнены ли сами поля (email, password, confirmPassword). Если поля пустые, ошибок нет, и isFormValid будет true, что даёт активную кнопку. Чтобы корректно блокировать кнопку при пустых полях, дописываю проверку значений каждого поля:

	const isFormValid =
		!errorEmail &&
		!errorPassword &&
		!errorConfirmPassword &&
		email.trim() !== "" &&
		password.trim() !== "" &&
		confirmPassword.trim() !== "";

	// 	Знак отрицания (!) у функций валидации используется потому, что каждая функция возвращает строку с ошибкой (например "Ошибка") или пустую строку (""). В логическом выражении пустая строка — это false, а непустая строка (текст ошибки) — это true.
	// Если поле заполнено правильно, validateEmail(email) вернёт "" (пустую строку), а это значит поле валидно и нет ошибок, но "" - это false, поэтому переворачиваем на true, ставим ! и это будет считаться, что поле валидно, итак: !"" превращается в true (поле валидно).
	// Если поле неправильно заполнено, функция возвращает текст ошибки ("Ошибка"), а текст это true, но у нас это пришла ошибка, значит нам нужно, чтобы было false: !"Ошибка" превращается в false.
	// Таким образом, вся форма валидна только если все функции возвращают пустую строку (нет ошибок) и отрицание каждой даёт true, то есть isFormValid == true

	// Интеграция и вычисление валидности. Мы записали это уже в обработчиках и потом позже написали интеграцию валидации для кнопки и для поля:
	// В компоненте кнопки:
	// <button disabled={!isFormValid}>Зарегистрироваться</button>
	// В компоненте поля:
	// Показываем ошибку, если поле touched и есть ошибка
	// {emailTouched && errorEmail && <div className="error">{errorEmail}</div>}

	return (
		<div className={styles.app}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<Field
					id="email"
					label="Почта"
					name="email"
					type="email"
					value={email}
					placeholder="Введите email"
					onChange={handleChangeEmail}
					onBlur={handleBlurEmail}
					touched={emailTouched}
					error={errorEmail}
				/>
				<Field
					id="password"
					label="Пароль"
					name="password"
					type="password"
					value={password}
					placeholder="Введите пароль"
					onChange={handleChangePassword}
					onBlur={handleBlurPassword}
					touched={passwordTouched}
					error={errorPassword}
				/>
				<Field
					id="confirmPassword"
					label="Повтор пароля"
					name="confirmPassword"
					type="confirmPassword"
					value={confirmPassword}
					placeholder="Повторите пароль"
					onChange={handleChangeConfirmPassword}
					onBlur={handleBlurConfirmPassword}
					touched={confirmPasswordTouched}
					error={errorConfirmPassword}
				/>

				<div className={styles.actions}>
					<button
						className={styles.button}
						type="submit"
						// кнопка будет блокироваться при невалидной форме
						disabled={!isFormValid}
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
