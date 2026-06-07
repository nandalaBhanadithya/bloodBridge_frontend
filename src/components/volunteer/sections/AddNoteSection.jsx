import { useState } from 'react'

export default function AddNoteSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="card">
      <div className="ctitle">Add a note or update</div>
      <div className="form-group">
        <label className="form-label">Related bridge</label>
        <select className="form-input">
          <option>Team Ramu · Ramu K.</option>
          <option>Team Priya · Priya M.</option>
          <option>Team Asha · Asha B.</option>
          <option>General / Not bridge-specific</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Note type</label>
        <select className="form-input">
          <option>Field observation</option>
          <option>Donor update</option>
          <option>Patient update</option>
          <option>Blood bank observation</option>
          <option>Event update</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Note</label>
        <textarea
          className="form-input"
          placeholder="e.g. Visited Ameerpet Clinic. Blood bank has capacity but no donors registered. Area has 340 guests within 10km — 2 have compatible blood type. Recommend urgent campaign."
          style={{ minHeight: 100 }}
        />
      </div>
      <button className={`btn btn-blue ${submitted ? 'btn-disabled' : ''}`} onClick={() => setSubmitted(true)}>
        {submitted ? 'Note submitted ✓' : 'Submit note to admin'}
      </button>
    </div>
  )
}
