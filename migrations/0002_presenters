-- Migration number: 0000 	 2025-08-29T18:30:00.000Z
CREATE TABLE presenters (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	topic TEXT NOT NULL,
	bio TEXT,
	created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert some sample data
INSERT INTO presenters (name, topic, bio)
VALUES
	('Ada Lovelace', 'The Analytical Engine and the First Algorithm', 'An English mathematician and writer, chiefly known for her work on Charles Babbage''s proposed mechanical general-purpose computer.'),
	('Grace Hopper', 'Pioneering COBOL and Compiler Technology', 'An American computer scientist and United States Navy rear admiral who was a pioneer of computer programming.'),
	('Alan Turing', 'On Computable Numbers and the Turing Machine', 'An English mathematician, computer scientist, logician, and cryptanalyst, highly influential in the development of theoretical computer science.');
