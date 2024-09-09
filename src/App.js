// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import Modal, { ModalHeader, ModalContent, ModalFooter } from "./Modal";

const initialSchemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

function App() {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] =
    useState(initialSchemaOptions);
  const [currentSchema, setCurrentSchema] = useState("");
  const [nameError, setNameError] = useState("");
  const [schemaError, setSchemaError] = useState("");
  const [addSchemaError, setAddSchemaError] = useState("");

  useEffect(() => {
    updateAvailableSchemas();
  }, [selectedSchemas]);

  const updateAvailableSchemas = () => {
    const selectedValues = selectedSchemas.map((schema) => schema.value);
    const newAvailableSchemas = initialSchemaOptions.filter(
      (schema) => !selectedValues.includes(schema.value)
    );
    setAvailableSchemas(newAvailableSchemas);
  };

  const handleSaveSegment = () => {
    setShowModal(true);
  };

  const handleSegmentName = (event) => {
    setSegmentName(event.target.value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSegmentName("");
    setSelectedSchemas([]);
    setCurrentSchema("");
  };

  const handleAddSchema = () => {
    if (!currentSchema) {
      setAddSchemaError("Please select a schema to add.");
      return;
    }
    setAddSchemaError("");
    const schemaToAdd = initialSchemaOptions.find(
      (schema) => schema.value === currentSchema
    );
    setSelectedSchemas([...selectedSchemas, schemaToAdd]);
    setCurrentSchema("");
  };

  const handleChangeSchema = (index, value) => {
    const newSchemas = [...selectedSchemas];
    const schemaToChange = initialSchemaOptions.find(
      (schema) => schema.value === value
    );
    newSchemas[index] = schemaToChange;
    setSelectedSchemas(newSchemas);
  };

  const handleRemoveSchema = (index) => {
    const newSchemas = [...selectedSchemas];
    newSchemas.splice(index, 1);
    setSelectedSchemas(newSchemas);
  };

  const handleSaveToServer = async () => {
    // Reset error messages
    setNameError("");
    setSchemaError("");

    // Validate segment name
    if (!segmentName.trim()) {
      setNameError("Please enter a segment name.");
      return;
    }

    // Validate at least one schema is selected
    if (selectedSchemas.length === 0) {
      setSchemaError("Please select at least one schema.");
      return;
    }

    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map((schema) => ({
        [schema.value]: schema.label,
      })),
    };

    try {
      const response = await fetch("/27a3c1d1-d5a7-42ca-a5f0-7523ca06ec65", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // console.log(response);
      if (response.ok) {
        alert("Segment saved successfully!");
        handleCloseModal();
      } else {
        alert("Error while saving segment.");
      }
    } catch (error) {
      console.log("Error: " + error);
      alert("An error while saving the segment.");
    }
  };

  return (
    <div className="App">
      <button className="custom-button" onClick={handleSaveSegment}>
        Save segment
      </button>
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <ModalHeader>
          <button className="close-btn" onClick={handleCloseModal}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h2>Saving Segment</h2>
        </ModalHeader>
        <ModalContent>
          <label className="label" htmlFor="segment-name">
            Enter the name of the segment
          </label>
          <input
            id="segment-name"
            className="custom-input"
            type="text"
            placeholder="Name of the segment"
            value={segmentName}
            onChange={handleSegmentName}
          />
          {nameError && <p className="error-message">{nameError}</p>}
          <p className="info">
            To save your segment, you need to add the schemas to build the
            query.
          </p>
          {schemaError && <p className="error-message">{schemaError}</p>}
          <div className="schema-block">
            {selectedSchemas.map((schema, index) => (
              <div key={index} className="selected-schema">
                <select
                  value={schema.value}
                  className="custom-select"
                  onChange={(e) => handleChangeSchema(index, e.target.value)}
                >
                  <option value={schema.value}>{schema.label}</option>
                  {availableSchemas.map((schema) => (
                    <option key={schema.value} value={schema.value}>
                      {schema.label}
                    </option>
                  ))}
                </select>
                <button
                  className="remove-schema-btn"
                  onClick={() => handleRemoveSchema(index)}
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>
            ))}
          </div>
          <select
            className="custom-select"
            value={currentSchema}
            onChange={(e) => setCurrentSchema(e.target.value)}
          >
            <option value="">Add schema to segment</option>
            {availableSchemas.map((schema) => (
              <option key={schema.value} value={schema.value}>
                {schema.label}
              </option>
            ))}
          </select>
          <button className="add-schema-btn" onClick={handleAddSchema}>
            + <u>Add new schema</u>
          </button>
          {addSchemaError && <p className="error-message">{addSchemaError}</p>}
        </ModalContent>
        <ModalFooter>
          <button
            onClick={handleSaveToServer}
            className="custom-button primary-btn"
          >
            Save the segment
          </button>
          <button
            onClick={handleCloseModal}
            className="custom-button secondary-btn"
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
