export interface Customer {
  id: number;
  customer_name: string;
  email: string;
  tempat_lahir: string;
  tanggal_lahir: string;
}

export interface CustomerTypeRequest {
  email: string;
  name: string;
  password: string;
  no_telp: string;
  address: string;
  place_of_birth: string;
  birth_date: string;
}
