import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router";

import SubsessionForm from "./CreateSubsessionForm";

import styles from "./CreateSession.module.css";

interface SessionFormProps {
  initialValues?: CreateSessionData;
}

const defaultSubsession: CreateSubsessionData = {
  title: "",
  timePerLoop: 10,
  goalIds: [],
};

const defaultValues: CreateSessionData = {
  title: "",
  structure: "Blocked",
  notes: "",
  numberOfLoops: 1,
  subsessions: [],
};

export default function CreateSessionPage({
  initialValues = defaultValues,
}: SessionFormProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateSessionData>({
    ...initialValues,
    subsessions: initialValues.subsessions.map((subsession) => ({
      ...subsession,
      goalIds: [...subsession.goalIds],
      time: 0,
    })),
  });

  const [allPieces, setAllPieces] = useState<ExtendedPieceData[]>([]);

  //Load all pieces
  useEffect(() => {
    async function loadPieces() {
      const data = await window.electron.getAllPiece();
      setAllPieces(data);
    }
    loadPieces();
  }, [location.pathname]);

  function updateField<K extends keyof CreateSessionData>(
    field: K,
    value: CreateSessionData[K],
  ) {
    setForm((prev) => {
      let numberOfLoops = prev.numberOfLoops;
      let currentSubsessions = prev.subsessions;
      if (field === "structure") {
        //Handle differently as structure would effect the display of loops
        if (value === "Blocked") {
          // numberOfLoops = 1;
        } else if (value === "Unstructured") {
          // numberOfLoops = 1;
          currentSubsessions = [];
        }
      }

      return {
        ...prev,
        numberOfLoops: numberOfLoops,
        subsessions: currentSubsessions,
        [field]: value,
      };
    });
  }

  function addSubsession() {
    setForm((prev) => ({
      ...prev,
      subsessions: [
        ...prev.subsessions,
        {
          ...defaultSubsession,
          goalIds: [],
        },
      ],
    }));
  }

  function removeSubsession(index: number) {
    setForm((prev) => ({
      ...prev,
      subsessions: prev.subsessions.filter((_, i) => i !== index),
    }));
  }

  function updateSubsession(index: number, value: CreateSubsessionData) {
    setForm((prev) => ({
      ...prev,
      subsessions: prev.subsessions.map((subsession, i) =>
        i === index ? value : subsession,
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.structure !== "Unstructured" && form.subsessions.length < 1) {
      return alert("Please add a subsession to continue");
    }

    console.log(form);
    const res = await window.electron.addNewSession({ sessionData: form });

    if (!res) {
      throw new Error("An error has occurred while Adding New Session");
    }
    console.log(res);
    navigate(`/session/${res}/view`);
  }

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/sessions" className="small">
          &lt; Back
        </NavLink>

        <h2>Create New Session</h2>
        <hr />
      </header>
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.mainForm}>
          <div className={styles.inputDiv}>
            {/* Session title */}
            <div className={styles.formField}>
              <label htmlFor="session-title" className="p">
                Title
              </label>

              <input
                id="session-title"
                name="title"
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
                className="input-deco"
              />
            </div>

            {/* Structure */}
            <div className={styles.formField}>
              <label htmlFor="session-structure" className="p">
                Structure
              </label>

              <select
                id="session-structure"
                name="structure"
                value={form.structure}
                onChange={(e) =>
                  updateField("structure", e.target.value as SessionStructure)
                }
                required
                className="input-deco"
              >
                <option value="Blocked">Blocked</option>

                <option value="Interleaved">Interleaved</option>

                <option value="Unstructured">Unstructured</option>
              </select>
            </div>

            {/* Number of loops */}
            {form.structure === "Interleaved" && (
              <div className={styles.formField}>
                <label htmlFor="session-loops" className="p">
                  Number of Loops
                </label>

                <input
                  id="session-loops"
                  name="numberOfLoops"
                  type="number"
                  min={1}
                  step={1}
                  value={form.numberOfLoops}
                  onChange={(e) =>
                    updateField("numberOfLoops", Number(e.target.value))
                  }
                  required
                  className="input-deco"
                />
              </div>
            )}
            {/* Time for Unstructured */}
            {form.structure === "Unstructured" && (
              <div className={styles.formField}>
                <label htmlFor="unstructuredTime" className="p">
                  Time
                </label>

                <input
                  id="unstructuredTime"
                  name="time"
                  type="number"
                  min={1}
                  max={180}
                  step={1}
                  value={form.time}
                  onChange={(e) => updateField("time", Number(e.target.value))}
                  required
                  className="input-deco"
                />
              </div>
            )}
            {/* Notes */}
            <div className={styles.formField}>
              <label htmlFor="session-notes" className="p">
                Notes
              </label>

              <textarea
                id="session-notes"
                name="notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="input-deco"
              />
            </div>
          </div>

          {/* Subsessions */}
          {form.structure !== "Unstructured" && (
            <section className={styles.subsessionsSection}>
              <div className={styles.subsessionsHeader}>
                <h2>Subsessions</h2>
                <button
                  type="button"
                  className="btn-blue"
                  onClick={addSubsession}
                >
                  Add Subsession
                </button>
              </div>

              {form.subsessions.length === 0 && (
                <p>No subsessions added yet.</p>
              )}

              <ul className={styles.subsessionsList}>
                {form.subsessions.map((subsession, index) => (
                  <SubsessionForm
                    key={index}
                    index={index}
                    value={subsession}
                    onChange={(value) => updateSubsession(index, value)}
                    onRemove={() => removeSubsession(index)}
                    allPieces={allPieces}
                  />
                ))}
              </ul>
            </section>
          )}

          {/* Buttons */}
          <div className={styles.actionSection}>
            <button
              type="button"
              className="btn-blue btn-blue-alt"
              onClick={() => {
                setForm(defaultValues);
              }}
            >
              Cancel
            </button>

            <button type="submit" className="btn-blue">
              Create Session
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
