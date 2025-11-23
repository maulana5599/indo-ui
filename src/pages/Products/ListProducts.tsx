import { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTable from "react-data-table-component";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { PencilIcon, PlusIcon, TrashBinIcon } from "../../icons";
import { ProductType, ProductTypeAdd } from "../../types/product.type";
import Api from "../../service/api";
import Select from "react-select";
import Swal from "sweetalert2";
import { debounce } from "lodash-es";

const queryClient = new QueryClient();

const Products = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ListProducts />
    </QueryClientProvider>
  );
};

const ListProducts = () => {
  const [open, setOpen] = useState(false);
  const [dataTable, setDataTable] = useState([] as ProductType[]);
  const [searchingProduct, setSearchProduct] = useState("" as string);
  const [brand] = useState([
    {
      value: "Nike",
      label: "Nike",
    },
    {
      value: "Adidas",
      label: "Adidas",
    },
    {
      value: "Puma",
      label: "Puma",
    },
    {
      value: "Apple",
      label: "Apple",
    },
  ] as any);

  const [product, setProduct] = useState({
    product_name: "",
    product_price: 0,
    brand: "",
    product_info: "",
    product_image_url: "",
  } as ProductTypeAdd);
  const columns = [
    {
      name: "Product Name",
      selector: (row: any) => row.product_name,
      sortable: true,
    },
    {
      name: "Product Price",
      selector: (row: any) => row.product_price,
      sortable: true,
      cell: (row: any) => {
        return <span>{formatRupiah(row.product_price)}</span>;
      },
    },
    {
      name: "Brand",
      selector: (row: any) => row.brand,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row: any) => row.year,
      sortable: false,
      cell: (row: ProductType) => {
        return (
          <>
            <button className="btn btn-sm btn-outline btn-warning me-2">
              <PencilIcon />
            </button>
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => deleteProduct(row.id)}
            >
              <TrashBinIcon />
            </button>
          </>
        );
      },
    },
  ];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", searchingProduct],
    queryFn: () => fetchProducts(searchingProduct),
  });

  const saveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You want to save this product !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Api.post("/products/add-product", product)
          .then((res) => {
            if (res.status === 200) {
              setOpen(false);
              setProduct({
                product_name: "",
                product_price: 0,
                brand: "",
                product_info: "",
                product_image_url: "",
              });

              Swal.fire({
                title: "Saved!",
                text: "Product has been saved.",
                icon: "success",
              }).then(() => {
                queryClient.invalidateQueries({
                  queryKey: ["products"],
                });
              });
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.status !== 200) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          });
      }
    });
  };

  const deleteProduct = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Api.delete(`/products/delete-product/${id}`)
          .then((res) => {
            if (res.status === 200) {
              queryClient.invalidateQueries({
                queryKey: ["products"],
              });
            }
            Swal.fire({
              title: "Deleted!",
              text: "Product has been deleted.",
              icon: "success",
            });
          })
          .catch((error) => {
            if (error.status !== 200) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          });
      }
    });
  };

  const searchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchProduct(value);
    }, 500),
    []
  );

  useEffect(() => {
    if (isLoading === false) {
      const result: ProductType[] = data?.data;
      setDataTable(result);
    }
  }, [isLoading, isFetching]);

  return (
    <>
      <PageMeta
        title="Indo Retreading and Tire Services"
        description="Indo Retreading and Tire Services"
      />
      <PageBreadcrumb pageTitle="Products" />
      <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-between mb-2">
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={() => setOpen(true)}
          >
            <PlusIcon />
            Product
          </button>
          <div className="w-full mb-2 flex justify-end">
            <input
              type="text"
              placeholder="Search..."
              className="input input-underline w-56"
              onInput={searchProduct}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={dataTable}
          pagination
          highlightOnHover
          fixedHeader
          fixedHeaderScrollHeight="500px"
          progressPending={isLoading}
          customStyles={{
            rows: {
              style: {
                paddingTop: "12px",
                paddingBottom: "12px",
              },
            },
          }}
        />

        {open && (
          <dialog className="modal modal-open">
            <div className="modal-box  w-11/12 max-w-5xl">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
              <form id="fomrProducts" onSubmit={saveProduct}>
                <fieldset className="fieldset">
                  <label className="label">Product Name</label>
                  <input
                    type="text"
                    className="input input-underline w-full"
                    placeholder="Product Name"
                    onChange={(e) =>
                      setProduct({ ...product, product_name: e.target.value })
                    }
                  />
                </fieldset>
                <fieldset className="fieldset my-3">
                  <label className="label">Product Price</label>
                  <input
                    type="number"
                    className="input input-underline w-full"
                    placeholder="Product Price"
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        product_price: Number(e.target.value),
                      })
                    }
                  />
                </fieldset>
                <fieldset className="fieldset my-3">
                  <label className="label">Product Brand</label>
                  <Select
                    options={brand}
                    isClearable
                    onChange={(e: any) =>
                      setProduct({ ...product, brand: e?.value })
                    }
                  />
                </fieldset>
                <fieldset className="fieldset my-3">
                  <label className="label">Product Image Url</label>
                  <input
                    type="text"
                    className="input input-underline w-full"
                    placeholder="Product Price"
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        product_image_url: e.target.value,
                      })
                    }
                  />
                </fieldset>
                <div className="my-2 flex justify-end">
                  <button className="btn btn-primary">Save Product</button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </>
  );
};

const fetchProducts = async (search: string) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const response = await Api.get(
    `${baseUrl}/products/get-products?search=${search}`
  );
  return response.data;
};

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};

export default Products;
