// ============================================================================
// CONTACT FORM QUERIES
// React Query hooks for contact form submission management
// ============================================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  ContactSubmission,
  ContactForm,
  TABLE_NAMES,
} from '@/lib/types/blog'

// ============================================================================
// CONTACT FORM SUBMISSIONS
// ============================================================================

/**
 * Submit contact form
 */
export function useContactSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (contactData: ContactForm): Promise<ContactSubmission> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
        .insert([
          {
            ...contactData,
            status: 'new',
          },
        ])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to submit contact form: ${error.message}`)
      }

      return data
    },
    onSuccess: (newSubmission) => {
      // Invalidate admin contact queries
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
      
      // Add to cache optimistically for admin view
      queryClient.setQueryData<ContactSubmission[]>(['contact-submissions'], (old) => {
        if (!old) return [newSubmission]
        return [newSubmission, ...old]
      })
    },
    onError: (error) => {
      console.error('Contact form submission error:', error)
    },
  })
}

// ============================================================================
// ADMIN CONTACT QUERIES
// ============================================================================

/**
 * Get all contact submissions (admin only)
 */
export function useContactSubmissions(status?: ContactSubmission['status']) {
  return useQuery({
    queryKey: ['contact-submissions', status],
    queryFn: async (): Promise<ContactSubmission[]> => {
      const supabase = createClient()

      let query = supabase
        .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
        .select('*')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Failed to fetch contact submissions: ${error.message}`)
      }

      return data || []
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for admin data
  })
}

/**
 * Get single contact submission
 */
export function useContactSubmissionById(id: string, enabled = true) {
  return useQuery({
    queryKey: ['contact-submission', id],
    queryFn: async (): Promise<ContactSubmission> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Contact submission not found')
        }
        throw new Error(`Failed to fetch contact submission: ${error.message}`)
      }

      return data
    },
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Update contact submission status
 */
export function useUpdateContactStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContactSubmission['status'] }): Promise<ContactSubmission> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update contact status: ${error.message}`)
      }

      return data
    },
    onSuccess: (updatedSubmission) => {
      // Invalidate contact submissions queries
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })
      
      // Update specific submission in cache
      queryClient.setQueryData<ContactSubmission>(
        ['contact-submission', updatedSubmission.id],
        updatedSubmission
      )

      // Update in the list cache
      queryClient.setQueryData<ContactSubmission[]>(['contact-submissions'], (old) => {
        if (!old) return [updatedSubmission]
        return old.map(submission =>
          submission.id === updatedSubmission.id ? updatedSubmission : submission
        )
      })
    },
    onError: (error) => {
      console.error('Error updating contact status:', error)
    },
  })
}

/**
 * Delete contact submission
 */
export function useDeleteContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const supabase = createClient()

      const { error } = await supabase
        .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete contact submission: ${error.message}`)
      }

      return id
    },
    onSuccess: (deletedId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] })

      // Remove from cache optimistically
      queryClient.setQueryData<ContactSubmission[]>(['contact-submissions'], (old) => {
        if (!old) return []
        return old.filter(submission => submission.id !== deletedId)
      })
    },
    onError: (error) => {
      console.error('Error deleting contact submission:', error)
    },
  })
}

/**
 * Get contact submission statistics
 */
export function useContactStats() {
  return useQuery({
    queryKey: ['contact-stats'],
    queryFn: async () => {
      const supabase = createClient()

      const [
        { count: total },
        { count: newSubmissions },
        { count: readSubmissions },
        { count: repliedSubmissions },
        { count: archivedSubmissions },
      ] = await Promise.all([
        supabase
          .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
          .select('*', { count: 'exact', head: true }),
        supabase
          .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new'),
        supabase
          .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
          .select('*', { count: 'exact', head: true })
          .eq('status', 'read'),
        supabase
          .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
          .select('*', { count: 'exact', head: true })
          .eq('status', 'replied'),
        supabase
          .from(TABLE_NAMES.CONTACT_SUBMISSIONS)
          .select('*', { count: 'exact', head: true })
          .eq('status', 'archived'),
      ])

      return {
        total: total || 0,
        new: newSubmissions || 0,
        read: readSubmissions || 0,
        replied: repliedSubmissions || 0,
        archived: archivedSubmissions || 0,
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}