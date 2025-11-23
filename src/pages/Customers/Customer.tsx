import DataTable from "react-data-table-component";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { PlusIcon, TrashBinIcon } from "../../icons";
import { Customer, CustomerTypeRequest } from "../../types/customer.type";
import React, { useCallback, useEffect, useState } from "react";
import axios from "../../service/api";
import Api from "../../service/api";
import Swal from "sweetalert2";
import { debounce } from "lodash-es";

const queryClient = new QueryClient();

const Customers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TableCustomer />
    </QueryClientProvider>
  );
};

const TableCustomer = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<Customer[]>([] as Customer[]);
  const [searchingCustomer, setSearchCustomer] = useState("" as string);
  const [payloadCustomer, setPayloadCustomer] = useState<CustomerTypeRequest>(
    {} as CustomerTypeRequest
  );
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["customer", searchingCustomer],
    queryFn: () => fetchCustomer(searchingCustomer),
  });

  const columns = [
    {
      name: "Customer Name",
      selector: (row: Customer) => row.customer_name,
    },
    {
      name: "Customer Email",
      selector: (row: Customer) => row.email,
    },
    {
      name: "Birthdate",
      selector: (row: Customer) => row.tempat_lahir,
      cell: (row: Customer) => {
        return <span>{row.tempat_lahir}</span>;
      },
    },
    {
      name: "Action",
      sortable: false,
      cell: (row: Customer) => {
        return (
          <>
            <button
              className="btn btn-outline btn-error btn-sm"
              onClick={(e) => deleteCustomer(e, row.id)}
            >
              <TrashBinIcon />
            </button>
          </>
        );
      },
    },
  ];

  const saveCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(payloadCustomer);

    const newPayload = {
      email: payloadCustomer.email,
      name: payloadCustomer.name,
      password: payloadCustomer.password,
      no_telp: payloadCustomer.no_telp,
      alamat: payloadCustomer.address,
      tempat_lahir: payloadCustomer.place_of_birth,
      tanggal_lahir: payloadCustomer.birth_date,
    };

    console.log(newPayload);
    Api.post("/register", newPayload)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setOpen(false);
          setPayloadCustomer({
            email: "",
            name: "",
            password: "",
            no_telp: "",
            address: "",
            place_of_birth: "",
            birth_date: "",
          });

          Swal.fire({
            title: "Success!",
            text: "Customer has been created.",
            icon: "success",
          });

          queryClient.invalidateQueries({
            queryKey: ["customer"],
          });
        }
      })
      .catch((error) => {
        if (error.status !== 200) {
          const message = error.response.data.message;
          if (error.response.status === 400) {
            let firstError: any = "";
            if (typeof message !== "string") {
              firstError = Object.keys(message)[0];
              firstError = `${firstError}: ${message[firstError]}`;
            } else {
              firstError = message;
            }

            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `${firstError}`,
              confirmButtonText: "Close",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: message,
              confirmButtonText: "Close",
            });
          }
        }
      });
  };

  const deleteCustomer = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Api.delete(`customers/delete-customer/${id}`)
          .then((res) => {
            if (res.status === 200) {
              queryClient.invalidateQueries({
                queryKey: ["customer"],
              });
            }
            Swal.fire({
              title: "Deleted!",
              text: "Customer has been deleted.",
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

  const searchCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchCustomer(value);
    }, 500),
    []
  );

  useEffect(() => {
    if (isLoading === false) {
      const result: Customer[] = data?.data;
      setDataTable(result);
    }
  }, [isLoading, isFetching]);

  return (
    <div>
      <PageMeta
        title="Indo Retreading and Tire Services"
        description="Indo Retreading and Tire Services"
      />
      <PageBreadcrumb pageTitle="Customers" />
      <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-between mb-2">
          <button
            className="btn btn-sm btn-outline btn-primary"
            onClick={() => setOpen(true)}
          >
            <PlusIcon />
            Customer
          </button>
          <div className="w-full mb-2 flex justify-end">
            <input
              type="text"
              placeholder="Search..."
              className="input input-underline w-56"
              onInput={searchCustomer}
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
              <form id="fomrProducts" onSubmit={saveCustomer}>
                <div className="grid grid-cols-12  gap-4">
                  <fieldset className="fieldset col-span-12 md:col-span-6">
                    <label className="label">Name</label>
                    <input
                      type="text"
                      className="input input-underline w-full"
                      placeholder="Name"
                      onChange={(e) =>
                        setPayloadCustomer({
                          ...payloadCustomer,
                          name: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                  <fieldset className="fieldset col-span-12 md:col-span-6">
                    <label className="label">Email Customer</label>
                    <input
                      type="email"
                      className="input input-underline w-full"
                      placeholder="Email"
                      onChange={(e) =>
                        setPayloadCustomer({
                          ...payloadCustomer,
                          email: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                  <fieldset className="fieldset col-span-12 md:col-span-4">
                    <label className="label">Password</label>
                    <input
                      type="text"
                      className="input input-underline w-full"
                      placeholder="Password"
                      onChange={(e) =>
                        setPayloadCustomer({
                          ...payloadCustomer,
                          password: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                  <fieldset className="fieldset col-span-12 md:col-span-4">
                    <label className="label">No. Telp</label>
                    <input
                      type="text"
                      className="input input-underline w-full"
                      placeholder="No. Telp"
                      onChange={(e) =>
                        setPayloadCustomer({
                          ...payloadCustomer,
                          email: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                  <fieldset className="fieldset col-span-12 md:col-span-4">
                    <label className="label">Address</label>
                    <input
                      type="text"
                      className="input input-underline w-full"
                      placeholder="Address"
                      onChange={(e) =>
                        setPayloadCustomer({
                          ...payloadCustomer,
                          address: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                  <fieldset className="fieldset col-span-12 md:col-span-4">
                    <label className="label">Place of birth</label>
                    <input
                      type="text"
                      className="input input-underline w-full"
                      placeholder="Place of birth"
                      onChange={(e) =>
                        setPayloadCustomer({
                          ...payloadCustomer,
                          place_of_birth: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                  <fieldset className="fieldset col-span-12 md:col-span-4">
                    <label className="label">Birth Date</label>

                    <input
                      type="date"
                      className="input w-full"
                      placeholder="Place of birth"
                      onChange={(e) =>
                        setPayloadCustomer({
                          ...payloadCustomer,
                          birth_date: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                </div>
                <div className="my-2 mt-5 flex justify-end">
                  <button className="btn btn-sm btn-primary">
                    <PlusIcon />
                    Save Customer
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

const fetchCustomer = async (search: string) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const response = await axios.get(`${baseUrl}/customers/get-customers?customer_name=${search}`);
  return response.data;
};

export default Customers;
