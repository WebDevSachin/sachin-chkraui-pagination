import { Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function JobListPagination() {
  // Declare state variable & set default value
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Declare constant with a total number of posts
  const totalCount = 1000;

  // Get current page value using useRouter() hook
  const router = useRouter();
  const { page } = router.query;

  // Set currentPage based on the query's page value
  useEffect(() => {
    if (page && !isNaN(page)) {
      setCurrentPage(parseInt(page));
    }
  }, [page]);

  // Set total pages based on the total count of posts and number of posts per page
  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / 10));
  }, [totalCount]);

  // Function for changing the page number
  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
    router.push(`/?page=${newPage}`);
  };

  // Array to keep track of which pages to show
  let pageButtons = [];

  // If there are less than or equal to 5 total pages,
  // show all page numbers as buttons
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(i);
    }
  }
  // If current page is within 2 pages of beginning or end of list,
  // show buttons for first 3 pages or last 3 pages respectively
  else {
    if (currentPage <= 2) {
      pageButtons = [1, 2, 3, '...', totalPages];
    } else if (currentPage >= totalPages - 1) {
      pageButtons = [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    // Otherwise, show buttons for previous 2/next 2 pages around current page
    else {
      pageButtons = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }

  return (
    // Flex containers for centering pagination
    <Flex justify="center">
      <Flex as="ul">
        {/* Disable prev button if no previous page exists */}
        <li>
          <Button type="button" isDisabled={currentPage <= 1 || totalPages === 0} onClick={() => currentPage > 1 && onPageChange(currentPage - 1)} m={2}>
            Previous
          </Button>
        </li>

        {/* Map through array of page buttons to create each button */}
        {pageButtons.map((pageNumber, index) => {
          // If button is an ellipsis, display it
          if (pageNumber === '...') {
            return (
              <li key={`pages-${index}`}>
                <div style={{ marginTop: 20 }}>...</div>
              </li>
            );
          }

          return (
            // Otherwise, create a numbered button
            <li key={`pages-${index}`}>
              <Button
                type="button"
                // Add blue color to selected button
                colorScheme={pageNumber === currentPage ? 'blue' : null}
                // For accessibility, highlight current page number
                selected={pageNumber === currentPage}
                aria-current={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
                m={2}
              >
                {pageNumber}
              </Button>
            </li>
          );
        })}

        {/* Disable next button if no next page exists */}
        <li>
          <Button type="button" isDisabled={currentPage == totalPages || totalPages === 0} onClick={() => onPageChange(currentPage + 1)} m={2}>
            Next
          </Button>
        </li>
      </Flex>
    </Flex>
  );
}
