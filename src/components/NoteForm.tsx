import { Col, Form, Row, Stack, Button } from 'react-bootstrap';
import CreatableReactSelect from 'react-select/creatable';

import { Link, useNavigate } from 'react-router-dom';

import { FormEvent, useRef, useState } from 'react';
import { NoteData, Tag } from '../App';

import { v4 as uuidV4 } from 'uuid';

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export const NoteForm = ({
  onSubmit,
  onAddTag,
  availableTags,
}: NoteFormProps) => {
  const titleRef = useRef<HTMLInputElement>(null!);
  const markdownRef = useRef<HTMLTextAreaElement>(null!);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    onSubmit({
      title: titleRef.current.value,
      markdown: markdownRef.current.value,
      tags: selectedTags,
    });
    navigate('..');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                value={selectedTags.map((tag) => {
                  return {
                    label: tag.label,
                    value: tag.id,
                  };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return {
                        label: tag.label,
                        id: tag.value,
                      };
                    })
                  );
                }}
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((previousValues) => [
                    ...previousValues,
                    newTag,
                  ]);
                }}
                options={availableTags.map((tag) => {
                  return {
                    label: tag.label,
                    value: tag.id,
                  };
                })}
                isMulti={true}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId='markdown'>
              <Form.Label>Body</Form.Label>
              <Form.Control
                ref={markdownRef}
                required
                as='textarea'
                rows={10}
              />
            </Form.Group>
          </Col>
        </Row>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <Button type='submit' variant='primary'>
            Save
          </Button>
          {/* Go one page back */}
          <Link to='..'>
            <Button type='button' variant='outline-secondary'>
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
};
