import React, { useState } from "react";
import sendBtn from "../../images/sendBtn.png";
import TableHead from "../TableHead";
import DeleteBtn from "../../images/DeleteBtn.png";
import EditBtn from "../../images/EditBtn.jpg";
import styles from "./contactTable.module.css"; // Import the CSS Module

const ContactTable = ({
  data: tableData,
  editMode,
  setEditMode,
  handleDeleteContact,
  updateContactDetails,
}) => {
  return (
    <div className={styles.contactTable}>
      {tableData.length > 0 && (
        <>
          <span className={styles.tableTitle}>Contact Person Details</span>
          <table className={styles.contactTable__table}>
            <thead>
              <tr>
                <th className={styles.contactTable__headerCell}>Name</th>
                <th className={styles.contactTable__headerCell}>Email</th>
                <th className={styles.contactTable__headerCell}>Mobile Number</th>
                <th className={styles.contactTable__headerCell}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={item.id}>
                  {editMode?.index === index ? (
                    // Render input fields and action buttons when in edit mode for this row
                    <>
                      <td>
                        <input
                          className={styles.contactTable__input}
                          type="text"
                          value={editMode.values.name || ""}
                          onChange={(e) => {
                            const updatedValue = e.target.value;
                            setEditMode((prev) => ({
                              ...prev,
                              values: { ...prev.values, name: updatedValue },
                            }));

                            // If the updated value is empty, set the state to null
                            if (updatedValue.trim() === "") {
                              setEditMode((prev) => ({
                                ...prev,
                                values: { ...prev.values, name: null },
                              }));
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.contactTable__input}
                          type="text"
                          value={editMode.values.email || ""}
                          onChange={(e) => {
                            const updatedValue = e.target.value;
                            setEditMode((prev) => ({
                              ...prev,
                              values: { ...prev.values, email: updatedValue },
                            }));

                            // If the updated value is empty, set the state to null
                            if (updatedValue.trim() === "") {
                              setEditMode((prev) => ({
                                ...prev,
                                values: { ...prev.values, email: null },
                              }));
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.contactTable__input}
                          type="text"
                          value={editMode.values.mobile || ""}
                          onChange={(e) => {
                            const updatedValue = e.target.value;
                            setEditMode((prev) => ({
                              ...prev,
                              values: { ...prev.values, mobile: updatedValue },
                            }));

                            // If the updated value is empty, set the state to null
                            if (updatedValue.trim() === "") {
                              setEditMode((prev) => ({
                                ...prev,
                                values: { ...prev.values, mobile: null },
                              }));
                            }
                          }}
                        />
                      </td>
                      <td className={styles.editBtns}>
                        <button className={styles.contactTable__buttonSave} onClick={() => updateContactDetails(index, editMode.values)}>Save</button>
                        <button className={styles.contactTable__buttonCancel} onClick={() => setEditMode(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    // Render static row and action buttons when not in edit mode for this row
                    <>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.mobile}</td>
                      <td>
                        <span className={styles.contactTable__action} onClick={() => setEditMode({ index, values: item })}>
                          <img className={styles.contactTable__icon} src={EditBtn} alt="Edit" />
                        </span>
                        <span className={styles.contactTable__action} onClick={() => handleDeleteContact(index)}>
                          <img className={styles.contactTable__icon} src={DeleteBtn} alt="Delete" />
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ContactTable;
