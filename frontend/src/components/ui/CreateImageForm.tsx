import FormInput from "./FormInput";

const CreateImageForm = ({
  createImage,
}: {
  createImage: (formData: FormData) => Promise<void>;
}) => {
  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createImage(formData);
        e.currentTarget.reset();
      }}
    >
      <FormInput
        label="Width"
        type="number"
        id="width"
        name="width"
        placeholder="800"
        min={400}
        max={2000}
        required
      />
      <FormInput
        label="Height"
        type="number"
id="height"
        name="height"
        placeholder="600"
        min={400}
        max={2000}
        required
      />

      <button className="bg-petrol-500 hover:bg-petrol-400 text-white font-semibold py-2 px-4 rounded">
        Create new Image
      </button>
    </form>
  );
};
export default CreateImageForm;
