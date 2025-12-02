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
      <div className="grid gap-2">
        <label htmlFor="width" className="text-sm font-medium">
          Width
        </label>
        <input
          type="number"
          id="width"
          name="width"
          placeholder="800"
          min={400}
          max={2000}
          required
          className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petrol-500 disabled:opacity-50 focus:invalid:ring-red-500"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="height" className="text-sm font-medium">
          Height
        </label>
        <input
          type="number"
          id="height"
          name="height"
          placeholder="600"
          min={400}
          max={2000}
          required
          className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petrol-500 disabled:opacity-50 focus:invalid:ring-red-500"
        />
      </div>

      <button className="bg-petrol-500 hover:bg-petrol-400 text-white font-semibold py-2 px-4 rounded">
        Create new Image
      </button>
    </form>
  );
};
export default CreateImageForm;
