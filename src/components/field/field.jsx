import styles from "./field.module.css";

const Field = (props) => {
	const { id, label, name, type, placeholder, register, error } = props;

	return (
		<div className={styles.field}>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				// {...register(name)} вешает на input value, onChange, onBlur и т.п. из React Hook Form.
				{...register(name)}
			/>
			{error && <div className={styles.error}>{error}</div>}
		</div>
	);
};

export default Field;
