import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { RoleProtector } from '@/components/role-protector';
import useSWR, { mutate } from 'swr';
import apiService, { apiServiceFetcher } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { DeleteIcon, EditIcon, PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { DialogClose } from '@radix-ui/react-dialog';
import { DataBlank } from '@/components/data-fallback';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
    name: z.string()
                .min(1, 'Minimal 1 karakter')
                .max(200, 'Maksimal 200 karakter')
});

export default function UnitPage() {
    const { data, isLoading } = useSWR('/units', apiServiceFetcher);

    return (
        <RoleProtector role="admin">
            <AdminLayout>
                <div className="flex justify-end my-4">
                    <CreateUnitOverlay />
                </div>
                {
                    !data || isLoading
                        ? <Skeleton className="w-full h-[300px]" />
                        : data.length > 0
                            ? <UnitList units={data} />
                            : <DataBlank />
                }
            </AdminLayout>
        </RoleProtector>
    );
}

function CreateUnitOverlay() {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    });

    const handleStore = useCallback((values: z.infer<typeof formSchema>) => {
        apiService()
            .post(`/units`, values)
            .then(() => {
                toast({
                    title: 'Unit berhasil dibuat'
                });
            })
            .catch(() => {
                toast({
                    title: 'Unit gagal dibuat'
                });
            })
            .finally(() => {
                form.reset();
                mutate('/units');
                setDialogOpen(false);
            });
    }, []);

    return (

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <Button variant="outline">
                    <PlusIcon />
                    Buat Unit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buat Unit</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleStore)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama unit</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Masukkan nama unit"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        <DialogFooter>
                            <DialogClose>
                                <Button type="button" variant="secondary">Batal</Button>
                            </DialogClose>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function UnitList({ units }: { units: any }) {
    return (
        <Table>
            <TableCaption>Daftar unit anda.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>&nbsp;</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    units.map((unit: any) => {
                        return (
                            <DataRow key={unit.id} unit={unit} />
                        );
                    })
                }
            </TableBody>
        </Table>
    );
}

function DataRow({ unit }: { unit: any }) {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: unit.name
        }
    });

    const deleteData = useCallback((id: number) => {
        apiService()
            .delete(`/units/${id}`)
            .then(() => {
                toast({
                    title: 'Unit berhasil dihapus'
                });
            })
            .catch(() => {
                toast({
                    title: 'Unit gagal dihapus'
                });
            })
            .finally(() => {
                mutate('/units');
            });
    }, []);

    const handleUpdate = useCallback((values: z.infer<typeof formSchema>) => {
        apiService()
            .put(`/units/${unit.id}`, values)
            .then(() => {
                toast({
                    title: 'Unit berhasil diperbarui'
                });
            })
            .catch(() => {
                toast({
                    title: 'Unit gagal diperbarui'
                });
            })
            .finally(() => {
                mutate('/units');
                setDialogOpen(false);
            });
    }, []);

    return (
        <TableRow>
            <TableCell className="font-medium">{unit.id}</TableCell>
            <TableCell>{unit.name}</TableCell>
            <TableCell className="text-right space-x-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger>
                        <Button
                            size="sm"
                            variant="outline">
                            <EditIcon />
                            Ubah
                        </Button>
                    </DialogTrigger>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteData(unit.id)}>
                        <DeleteIcon />
                        Hapus
                    </Button>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Perbarui Unit</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                                <FormField
                                    name="name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama unit</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Masukkan nama unit"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <DialogFooter>
                                    <DialogClose>
                                        <Button type="button" variant="secondary">Batal</Button>
                                    </DialogClose>
                                    <Button type="submit">Simpan</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    );
}