import { gql } from "@apollo/client";

export const mockTypeDefs = gql`
  extend type OrganizationMembership {
    mock_teachers: 
  }

  extend type User {
    mock_user_id: ID!
    mock_user_name: String
  }
`;

export const mockResolvers = {
  // User: {
  //   user_id: () => "7d0ad09a-11ab-4147-9734-974276f397d1",
  //   user_name: () => "Ivan Barradas",
  // },
  OrganizationMembership: {
    teachers: () => [
      {
        user: {
          user_id: "7d0ad09a-11ab-4147-9734-974276f397d1",
          user_name: "Ivan Barradas",
        },
      },
    ],
  },
};
