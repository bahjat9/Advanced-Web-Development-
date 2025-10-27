const inputFactory = (type, id, className, ariaDescribedby) => {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.classList.add(className);
  input.setAttribute("aria-describedby", ariaDescribedby);
  return input;
};

const labelFactory = (text, htmlFor) => {
  const label = document.createElement("label");
  label.htmlFor = htmlFor;
  label.classList.add("form-label");
  label.textContent = text;
  return label;
};

export const formFactory = () => {
  const form = document.createElement("form");
  form.classList.add("p-2");
  const nameLabel = labelFactory("User Name", "userName");
  const nameInput = inputFactory("text", "userName", "form-control", "nameHelp");
  const ageLabel = labelFactory("User Age", "userAge");
  const ageInput = inputFactory("number", "userAge", "form-control", "ageHelp");
  const imageLabel = labelFactory("User Image URL", "UserImage");
  const imageInput = inputFactory("url", "UserImage", "form-control", "imageHelp");
  const genderLabel = labelFactory("Gender", "UserGender");
  const genderInput = inputFactory("text", "UserGender", "form-control", "genderHelp");
  const appendNode = (parent, child) => parent.appendChild(child);

  appendNode(form, nameLabel);
  appendNode(form, nameInput);
  appendNode(form, ageLabel);
  appendNode(form, ageInput);
  appendNode(form, imageLabel);
  appendNode(form, imageInput);
  appendNode(form, genderLabel);
  appendNode(form, genderInput);

  return form;
};