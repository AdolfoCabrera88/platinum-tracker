import { useState } from 'react';

const PlatinumForm = ({ initialValues, onSubmit, submitLabel, error, onCancel }) => {

    const toNumberOrNull = (value) => (value === '' || value == null ? null : Number(value));

    const [platinumForm, setPlatinumForm] = useState(initialValues);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const values = {
            hours_spent: toNumberOrNull(platinumForm.hours_spent),
            personal_difficulty: toNumberOrNull(platinumForm.personal_difficulty),
            notes: platinumForm.notes
        };

         setSubmitting(true);

        try {
            await onSubmit(values);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            className="card form-card"
            onSubmit={handleSubmit}
        >

            <div className="form-group">

                <label
                    htmlFor="hours-spent"
                    className="form-label"
                >
                    Hours Spent <span className="form-optional">(optional)</span>
                </label>

                <input
                    id="hours-spent"
                    className="form-input"
                    type="number"
                    name="hours_spent"
                    min="1"
                    max="5000"
                    step="1"
                    placeholder="How many hours did it take?"
                    value={platinumForm.hours_spent}
                    onChange={(e) =>
                        setPlatinumForm((prev) => ({
                            ...prev,
                            hours_spent: e.target.value
                        }))
                    }
                />

            </div>

            <div className="form-group">

                <label
                    htmlFor="personal-difficulty"
                    className="form-label"
                >
                    Personal Difficulty <span className="form-optional">(optional)</span>
                </label>

                <input
                    id="personal-difficulty"
                    className="form-input"
                    type="number"
                    name="personal_difficulty"
                    min="1"
                    max="10"
                    placeholder="Difficulty from 1–10"
                    value={platinumForm.personal_difficulty}
                    onChange={(e) =>
                        setPlatinumForm((prev) => ({
                            ...prev,
                            personal_difficulty: e.target.value
                        }))
                    }
                />

            </div>

            <div className="form-group">

                <label
                    htmlFor="platinum-notes"
                    className="form-label"
                >
                    Notes <span className="form-optional">(optional)</span>
                </label>

                <textarea
                    id="platinum-notes"
                    className="form-textarea"
                    name="notes"
                    maxLength={2000}
                    placeholder="Write about your platinum experience..."
                    value={platinumForm.notes}
                    onChange={(e) =>
                        setPlatinumForm((prev) => ({
                            ...prev,
                            notes: e.target.value
                        }))
                    }
                />

            </div>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : submitLabel}
                </button>
            
            {onCancel && (
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            )}

        </form>
    )
}

export default PlatinumForm;