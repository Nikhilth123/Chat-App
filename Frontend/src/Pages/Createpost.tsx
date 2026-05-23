export default function Createpost() {
  return (
    <div className="min-h-screen bg-muted/40 flex justify-center">  
        <div className="w-full max-w-3xl px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
            <form className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Title"
                    className="border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <textarea
                    placeholder="Content"
                    className="border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={5}
                />
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    Create Post
                </button>
            </form>
        </div>
    </div>
  );
}