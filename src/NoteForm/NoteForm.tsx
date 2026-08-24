import css from "./NoteForm.module.css";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage } from "formik";
import { createNote } from "../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NoteForm({ onClose }: { onClose: () => void }) {
  const Tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
  type Tag = (typeof Tags)[number];
  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationFn: (newNote: { title: string; content: string; tag: Tag }) =>
      createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required").min(3).max(50),
    content: Yup.string().max(500),
    tag: Yup.string().required("Tag is required").oneOf(Tags),
  });

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" as Tag }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const value: { title: string; content: string; tag: Tag } = {
          title: values.title.trim(),
          content: values.content?.trim() || "",
          tag: values.tag as Tag,
        };
        createNoteMutation.mutate(value);
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
