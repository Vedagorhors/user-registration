import styles from "./field.module.css";

const Field = (props) => {
	const {
		id,
		label,
		name,
		type,
		value,
		placeholder,
		onChange,
		onBlur,
		touched,
		error,
	} = props;
	return (
		<div className={styles.field}>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				name={name}
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				onBlur={onBlur}
			/>
			{/* Отображение ошибок: сначала поле должно быть “потрогано”, затем нужна непустая строка ошибки. Показываем ошибку под полем input, если поле touched (потрогано) и есть текст ошибки */}
			{touched && error && <div className={styles.error}>{error}</div>}
		</div>
	);
};

export default Field;
