/**
 * function to be used in order to clean every key that is undefined.
 * @param filter
 */
const removeEmpty = (filter: any) => Object.keys(filter).forEach((key) => (filter[key] == null) && delete filter[key]);
export default removeEmpty;
