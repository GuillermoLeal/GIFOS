/**
 * @description Eliminar objeto de un array
 */
export const removeItemObjFromArr = (arr, id) => {
	const i = arr.map((itemArray) => itemArray.id).indexOf(id);

	if (i !== -1) {
		arr.splice(i, 1);
	}
};
