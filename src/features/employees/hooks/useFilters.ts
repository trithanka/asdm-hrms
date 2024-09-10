import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import toast from "react-hot-toast";
import { fetchFilters } from "../../../api/employee/employee-api";
import QUERY_KEYS from "../../../data/queryKeys";

export default function useFilters() {
  const query = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEE_FILTERS],
    queryFn: fetchFilters,
    meta: {
      errorMessage: "Failed to fetch locations",
    },
  });

  React.useEffect(() => {
    if (query?.isSuccess) {
      if (query?.data?.status !== "success") {
        toast?.error(query?.data?.message ?? "Something went wrong!");
      }
    }
  }, [query.isSuccess]);

  const genders = query?.data?.gender?.map((gender) => ({
    label: gender.genderName,
    value: gender.genderId.toString(),
  }));

  const districts = query?.data?.district?.map((district) => ({
    label: district.districtName,
    value: district.districtId,
  }));

  const castes = query?.data?.caste?.map((caste) => ({
    label: caste.casteName,
    value: caste.casteId,
  }));

  const bloodGroups = query?.data?.blood?.map((blood) => ({
    label: blood.bloodName,
    value: blood.bloodId,
  }));

  const designations = query?.data?.designation?.map((designation) => ({
    label: designation.designationName,
    value: designation.designationId,
  }));

  const relationships = query?.data?.relationship?.map((relation) => ({
    label: relation.relationshipName,
    value: relation.relationshipId,
  }));

  const qualifications = query?.data?.qualification?.map((qual) => ({
    label: qual.qualificationName,
    value: qual.qualificationId,
  }));

  const current_working_location = query?.data?.location?.map((item) => ({
    label: item.locationName,
    value: item.locationId,
  }))

  const supervisor = query?.data?.supervisor?.map((item) => ({
    label: item.name,
    value: item.supervisorId,
  })) 

  const departments = query?.data?.department?.map((dept) => ({
    label: dept.internalDepartmentName,
    value: dept.internalDepartmentId,
  }));

  const banks = query?.data?.bank?.map((bank) => ({
    label: bank.bankName,
    value: bank.bankId,
  }));

  const religions = query?.data?.religion.map((rel) => ({
    label: rel.religionName,
    value: rel.religionId,
  }));

  return {
    isLoading: query.isLoading,
    idTypes: query?.data?.idType,
    maritalStatues: query?.data?.marital,
    genders,
    districts,
    castes,
    bloodGroups,
    designations,
    relationships,
    qualifications,
    departments,
    current_working_location,
    banks,
    religions,
    supervisor,
  };
}
