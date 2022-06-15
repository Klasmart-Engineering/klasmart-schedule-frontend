import { gql } from "@apollo/client";

export const USER_NODE_FIELDS = gql`
  fragment UserNodeFields on UserConnectionNode {
    id
    givenName
    familyName
    dateOfBirth
    contactInfo {
      email
      phone
      username
    }
    alternateContactInfo {
      email
      phone
      username
    }
    roles {
      id
      name
      organizationId
      schoolId
    }
  }
`;

export const GET_CLASS_NODE_ROSTER = gql`
  ${USER_NODE_FIELDS}
  query getClassNodeRoster(
    $id: ID!
    $count: PageSize
    $direction: ConnectionDirection!
    $orderBy: [UserSortBy!]!
    $order: SortOrder!
    $cursor: String
    $showStudents: Boolean!
    $showTeachers: Boolean!
    $filter: UserFilter
  ) {
    classNode(id: $id) {
      name
      schools {
        id
      }
      studentsConnection(count: $count, direction: $direction, cursor: $cursor, sort: { field: $orderBy, order: $order }, filter: $filter)
        @include(if: $showStudents) {
        edges {
          node {
            ...UserNodeFields
          }
        }
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
      teachersConnection(count: $count, direction: $direction, cursor: $cursor, sort: { field: $orderBy, order: $order }, filter: $filter)
        @include(if: $showTeachers) {
        edges {
          node {
            ...UserNodeFields
          }
        }
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;
