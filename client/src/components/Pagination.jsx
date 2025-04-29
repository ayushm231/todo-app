const Pagination = ({ page, pages, setPage }) => {
    const pagesArray = [...Array(pages).keys()].map(x => x + 1);
    return (
        <div className="flex justify-center mt-4 gap-2">
          {pagesArray.map(p => (
            <button
              key={p}
              className={`px-4 py-2 rounded ${p === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      );
}

export default Pagination;