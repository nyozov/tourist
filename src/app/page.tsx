import SearchForm from "./components/SearchForm";

const Home = () => {
  return (
      <main className="flex h-[calc(100vh-65px)] w-full flex-col items-center justify-between py-32 px-8 lg:px-16">
        <SearchForm />
      </main>
  );
}

export default Home;
