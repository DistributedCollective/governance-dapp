import React from 'react';
import styled from 'styled-components/macro';

export function PageSkeleton() {
  return (
    <div className="container py-8">
      <div className="skeleton my-3 w-2/5">Loading...</div>
      <div className="flex space-x-4 my-3">
        <div className="skeleton w-1/3">Loading...</div>
        <div className="skeleton w-1/3">Loading...</div>
        <div className="skeleton w-1/3">Loading...</div>
      </div>
      <div className="skeleton my-3">Loading...</div>
      <div className="skeleton my-3 w-2/3">Loading...</div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex space-x-4">
      <div className="skeleton w-1/3">Loading...</div>
      <div className="skeleton w-1/3">Loading...</div>
      <div className="skeleton w-1/3">Loading...</div>
    </div>
  );
}

interface Props {
  lines: number;
}
export function ComponentSkeleton({ lines }: Props) {
  return (
    <div className="container">
      {Array(lines).map((_, index) => (
        <div className="row my-3" key={index}>
          {index % 2 !== 0 && (
            <>
              <div className="col-4">
                <Skeleton />
              </div>
              <div className="col-8">
                <Skeleton />
              </div>
            </>
          )}
          {index % 2 === 0 && (
            <>
              <div className="col-3">
                <Skeleton />
              </div>
              <div className="col-6">
                <Skeleton />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

ComponentSkeleton.defaultProps = {
  lines: 1,
};

interface SkeletonProps {
  width?: string;
  height?: string;
  inline?: boolean;
}

export const Skeleton = styled.div.attrs(props => ({
  className: 'bp3-skeleton',
}))`
  width: ${(props: SkeletonProps) => (props.width ? props.width : '100%')};
  height: ${(props: SkeletonProps) => (props.height ? props.height : '16px')};
  display: ${(props: SkeletonProps) =>
    props.inline ? 'inline-block' : 'block'};
  margin: 5px;
`;
